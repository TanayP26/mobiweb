export interface ContactSubmission {
  name: string
  email: string
  organisation: string
  inquiryType: string
  message: string
  website: string
}

const inquiryTypes = new Set([
  "Collaborations",
  "Sponsorships",
  "Workshops",
  "Technical Partnerships",
  "Student Opportunities",
])

export function validateContact(value: ContactSubmission): string | null {
  if (value.name.length < 2 || value.name.length > 100)
    return "Please enter a name between 2 and 100 characters."
  if (
    value.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
  )
    return "Please enter a valid email address."
  if (value.organisation.length > 150)
    return "Please keep the organisation name within 150 characters."
  if (!inquiryTypes.has(value.inquiryType))
    return "Please select an inquiry type."
  if (value.message.length < 10 || value.message.length > 5000)
    return "Please enter a message between 10 and 5000 characters."
  return null
}

export async function submitContact(value: ContactSubmission): Promise<void> {
  const projectUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(
    /\/+$/,
    "",
  )
  const publicKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  if (!projectUrl || !publicKey) throw new Error("Contact service unavailable")

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15000)
  try {
    // This public function does not require a user session or a browser SDK.
    const response = await fetch(`${projectUrl}/functions/v1/submit-contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: publicKey,
      },
      body: JSON.stringify(value),
      signal: controller.signal,
    })
    const result: unknown = await response.json()
    if (
      !response.ok ||
      typeof result !== "object" ||
      result === null ||
      !("success" in result) ||
      result.success !== true
    ) {
      throw new Error("Message delivery failed")
    }
  } finally {
    window.clearTimeout(timeout)
  }
}
