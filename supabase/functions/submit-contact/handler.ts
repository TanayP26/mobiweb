export const INQUIRY_TYPES = [
  "Collaborations",
  "Sponsorships",
  "Workshops",
  "Technical Partnerships",
  "Student Opportunities",
]
const MAX_BODY_BYTES = 12000
const TYPE_ALIASES: Record<string, string> = {
  collab: "Collaborations",
  sponsor: "Sponsorships",
  workshop: "Workshops",
  partnership: "Technical Partnerships",
  opportunity: "Student Opportunities",
}
const VALIDATION_ERROR = "Please check the submitted information."
const SERVICE_ERROR = "We could not save your message. Please try again later."
const allowedFields = new Set([
  "name",
  "email",
  "organisation",
  "inquiryType",
  "message",
  "website",
])

interface ContactMessage {
  name: string
  email: string
  organisation: string | null
  inquiry_type: string
  message: string
}

export interface Dependencies {
  allowedOrigins: string[]
  save: (message: ContactMessage, dedupeKey: string) => Promise<void>
  now?: () => number
}

class RequestError extends Error {
  constructor(readonly status: number) {
    super(VALIDATION_ERROR)
  }
}

async function readBody(req: Request): Promise<unknown> {
  if (Number(req.headers.get("content-length")) > MAX_BODY_BYTES)
    throw new RequestError(413)
  if (!req.body) throw new RequestError(400)
  const reader = req.body.getReader()
  let timedOut = false
  const timeout = setTimeout(() => {
    timedOut = true
    void reader.cancel().catch(() => {})
  }, 10000)
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (timedOut) throw new RequestError(408)
      if (done) break
      size += value.byteLength
      if (size > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {})
        throw new RequestError(413)
      }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) {
      bytes.set(chunk, offset)
      offset += chunk.byteLength
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes))
  } finally {
    clearTimeout(timeout)
    reader.releaseLock()
  }
}

function validate(body: unknown): ContactMessage {
  if (typeof body !== "object" || body === null || Array.isArray(body))
    throw new RequestError(400)
  const value = body as Record<string, unknown>
  if (Object.keys(value).some((key) => !allowedFields.has(key)))
    throw new RequestError(400)
  for (const key of ["name", "email", "inquiryType", "message"]) {
    if (typeof value[key] !== "string") throw new RequestError(400)
  }
  if (
    value.organisation !== undefined &&
    typeof value.organisation !== "string"
  )
    throw new RequestError(400)
  // Reject honeypot submissions without creating a record or pretending to save it.
  if (value.website !== undefined && value.website !== "")
    throw new RequestError(400)
  const name = (value.name as string).trim()
  const email = (value.email as string).trim().toLowerCase()
  const organisation = (value.organisation as string | undefined ?? "").trim()
  const message = (value.message as string).trim()
  const rawType = (value.inquiryType as string).trim()
  const inquiryType = TYPE_ALIASES[rawType] ?? rawType
  if (
    name.length < 2 ||
    name.length > 100 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    organisation.length > 150 ||
    !INQUIRY_TYPES.includes(inquiryType) ||
    message.length < 10 ||
    message.length > 5000 ||
    [name, email, organisation, message].some((field) => field.includes("\0"))
  ) {
    throw new RequestError(400)
  }
  return {
    name,
    email,
    organisation: organisation || null,
    inquiry_type: inquiryType,
    message,
  }
}

export function createHandler({
  allowedOrigins,
  save,
  now = Date.now,
}: Dependencies) {
  return async (req: Request): Promise<Response> => {
    const origin = req.headers.get("origin")
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Vary: "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    }
    if (origin && allowedOrigins.includes(origin))
      headers["Access-Control-Allow-Origin"] = origin
    const json = (status: number, message?: string) =>
      new Response(
        JSON.stringify(
          message ? { success: false, message } : { success: true },
        ),
        { status, headers },
      )
    // Fail closed if the deployment has not configured its website origins.
    if (!allowedOrigins.length) return json(503, SERVICE_ERROR)
    if (origin && !allowedOrigins.includes(origin))
      return json(403, "Request not allowed.")
    if (req.method === "OPTIONS")
      return new Response(null, { status: 204, headers })
    if (req.method !== "POST") {
      headers.Allow = "POST, OPTIONS"
      return json(405, "Method not allowed.")
    }
    if (
      req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
      "application/json"
    ) {
      return json(415, VALIDATION_ERROR)
    }
    let message: ContactMessage
    try {
      message = validate(await readBody(req))
    } catch (error) {
      return json(
        error instanceof RequestError ? error.status : 400,
        VALIDATION_ERROR,
      )
    }
    try {
      // Future CAPTCHA / distributed rate-limit checks belong before save().
      // Match the deployed function's content-based, one-minute duplicate key.
      const fingerprint = [
        message.email,
        message.inquiry_type,
        message.message,
        String(Math.floor(now() / 60000)),
      ].join("\u001f")
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(fingerprint),
      )
      const dedupeKey = [...new Uint8Array(digest)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      await save(message, dedupeKey)
      return json(200)
    } catch {
      // Never return or log submitted personal information or database errors.
      console.error("submit-contact: storage request failed")
      return json(503, SERVICE_ERROR)
    }
  }
}
