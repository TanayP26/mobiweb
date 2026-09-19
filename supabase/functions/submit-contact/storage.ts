import type { ContactMessage } from "./handler.ts"

export function createStorage(
  url: string | undefined,
  serviceRoleKey: string | undefined,
  request = fetch,
) {
  return async (message: ContactMessage, dedupeKey: string): Promise<{
    createdAt: string
  } | null> => {
    if (!url || !serviceRoleKey) throw new Error("Storage unavailable")
    const response = await request(
      `${url}/rest/v1/contact_messages?on_conflict=dedupe_key&select=created_at`,
      {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=ignore-duplicates,return=representation",
        },
        body: JSON.stringify({ ...message, dedupe_key: dedupeKey }),
        signal: AbortSignal.timeout(10000),
      },
    )
    if (!response.ok) {
      await response.body?.cancel()
      throw new Error("Storage unavailable")
    }
    const rows: unknown = await response.json()
    if (!Array.isArray(rows)) throw new Error("Storage unavailable")
    // DO NOTHING returns no row for a conflict, including concurrent retries.
    if (rows.length === 0) return null
    if (rows.length !== 1 || typeof rows[0]?.created_at !== "string")
      throw new Error("Storage unavailable")
    return { createdAt: rows[0].created_at }
  }
}
