import { createHandler, INQUIRY_TYPES } from "./handler.ts"

const origin = "http://localhost:8443"
const valid = {
  name: "  Test Person  ",
  email: "  TEST@example.com  ",
  organisation: "  Club  ",
  inquiryType: "Collaborations",
  message: "  A useful contact message.  ",
  website: "",
}

Deno.test("legacy aliases and minute buckets match deployed duplicate protection", async () => {
  const keys: string[] = []
  let time = 60000
  const handler = createHandler({
    allowedOrigins: [origin],
    now: () => time,
    save: async (row, key) => {
      assert(row.inquiry_type === "Collaborations")
      keys.push(key)
    },
  })
  assert((await handler(request(valid))).status === 200)
  assert(
    (await handler(request({ ...valid, inquiryType: "collab" }))).status ===
      200,
  )
  assert(keys[0] === keys[1])
  time = 120000
  await handler(request(valid))
  assert(keys[2] !== keys[0])
  const fingerprint = [
    "test@example.com",
    "Collaborations",
    "A useful contact message.",
    "1",
  ].join("\u001f")
  const expected = [
    ...new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(fingerprint),
      ),
    ),
  ]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  assert(keys[0] === expected)
})
function assert(
  condition: unknown,
  message = "Assertion failed",
): asserts condition {
  if (!condition) throw new Error(message)
}
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request(
    "https://example.supabase.co/functions/v1/submit-contact",
    {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    },
  )
}

Deno.test("all five inquiry labels are stored with trimmed fields", async () => {
  for (const inquiryType of INQUIRY_TYPES) {
    let saved = false
    const handler = createHandler({
      allowedOrigins: [origin],
      save: async (row, id) => {
        assert(row.name === "Test Person" && row.email === "test@example.com")
        assert(row.organisation === "Club" && row.inquiry_type === inquiryType)
        assert(
          row.message === "A useful contact message." &&
            /^[0-9a-f]{64}$/.test(id),
        )
        saved = true
      },
    })
    const response = await handler(request({ ...valid, inquiryType }))
    assert(response.status === 200 && saved)
    assert(JSON.stringify(await response.json()) === '{"success":true}')
  }
})

Deno.test("invalid and honeypot payloads never reach storage", async () => {
  let writes = 0
  const handler = createHandler({
    allowedOrigins: [origin],
    save: async () => {
      writes++
    },
  })
  const invalid = [
    null,
    [],
    {},
    "text",
    { ...valid, name: " " },
    { ...valid, name: "x".repeat(101) },
    { ...valid, email: "bad-email" },
    { ...valid, email: "x".repeat(250) + "@a.co" },
    { ...valid, organisation: 3 },
    { ...valid, organisation: "x".repeat(151) },
    { ...valid, inquiryType: "Other" },
    { ...valid, message: "   " },
    { ...valid, message: "short" },
    { ...valid, message: "x".repeat(5001) },
    { ...valid, website: "spam.example" },
    { ...valid, status: "read" },
    { ...valid, message: "null\0character" },
  ]
  for (const body of invalid) {
    const response = await handler(request(body))
    assert(response.status === 400)
    assert((await response.json()).success === false)
  }
  assert(writes === 0)
})

Deno.test("optional organisation, boundaries and content duplicate key", async () => {
  const keys: string[] = []
  const handler = createHandler({
    allowedOrigins: [origin],
    now: () => 60000,
    save: async (row, key) => {
      keys.push(key)
      assert(
        row.organisation === null &&
          row.message.length === 5000 &&
          key.length === 64,
      )
    },
  })
  const response = await handler(
    request({
      ...valid,
      name: "AB",
      organisation: undefined,
      message: "x".repeat(5000),
    }),
  )
  assert(response.status === 200)
  assert((await response.json()).success === true)
  await handler(
    request({
      ...valid,
      name: "AB",
      organisation: undefined,
      message: "x".repeat(5000),
    }),
  )
  assert(keys.length === 2 && keys[0] === keys[1])
})

Deno.test("malformed, oversized and incorrect media types are rejected", async () => {
  const handler = createHandler({
    allowedOrigins: [origin],
    save: async () => {
      throw new Error("Must not store")
    },
  })
  const malformed = new Request("https://example.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  })
  assert((await handler(malformed)).status === 400)
  assert(
    (await handler(request(valid, { "Content-Type": "text/plain" }))).status ===
      415,
  )
  assert(
    (await handler(request(valid, { "Content-Length": "50000" }))).status ===
      413,
  )
  assert(
    (await handler(request({ ...valid, message: "x".repeat(40000) })))
      .status === 413,
  )
})

Deno.test("CORS, methods and missing origin configuration", async () => {
  const handler = createHandler({
    allowedOrigins: [origin],
    save: async () => {},
  })
  const preflight = await handler(
    new Request("https://example.com", {
      method: "OPTIONS",
      headers: { Origin: origin },
    }),
  )
  assert(
    preflight.status === 204 &&
      preflight.headers.get("Access-Control-Allow-Origin") === origin,
  )
  const denied = await handler(
    request(valid, { Origin: "https://evil.example" }),
  )
  assert(
    denied.status === 403 && !denied.headers.has("Access-Control-Allow-Origin"),
  )
  assert((await handler(new Request("https://example.com"))).status === 405)
  const unconfigured = createHandler({
    allowedOrigins: [],
    save: async () => {},
  })
  assert((await unconfigured(request(valid))).status === 503)
})

Deno.test("storage failures return a generic response without internal details", async () => {
  const handler = createHandler({
    allowedOrigins: [origin],
    save: async () => {
      throw new Error("private SQL credentials")
    },
  })
  const response = await handler(request(valid))
  assert(response.status === 503)
  assert(!(await response.text()).includes("private SQL"))
})
