import type { ContactMessage } from "./handler.ts"

interface NotificationConfig {
  apiKey?: string
  to?: string
  from?: string
}

export function createNotifier(config: NotificationConfig, request = fetch) {
  const apiKey = config.apiKey?.trim()
  const recipients = (config.to ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
  const from = config.from?.trim()
  let warned = false
  return async (
    message: ContactMessage,
    createdAt: string,
    signal: AbortSignal,
  ): Promise<void> => {
    if (!apiKey || recipients.length === 0 || !from) {
      if (!warned)
        console.warn(
          "submit-contact: email configuration missing; notification skipped",
        )
      warned = true
      return
    }
    // Plain text only: visitor content is never interpreted as HTML.
    const text = [
      "New MOBiLON contact inquiry",
      "",
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Organisation: ${message.organisation || "Not provided"}`,
      `Inquiry type: ${message.inquiry_type}`,
      `Submitted at: ${createdAt}`,
      "",
      "Message:",
      message.message,
      "",
      "This message was submitted through the MOBiLON website.",
    ].join("\n")
    const response = await request("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: message.email,
        subject: `[MOBiLON] ${message.inquiry_type} inquiry from ${message.name.replace(/[\r\n\u0000-\u001f\u007f]/g, " ")}`,
        text,
      }),
      signal,
    })
    // Do not read or log provider response bodies (including errors).
    await response.body?.cancel()
    if (!response.ok) throw new Error("Notification unavailable")
  }
}
