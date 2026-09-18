import { createHandler } from "./handler.ts"

Deno.serve(
  createHandler({
    allowedOrigins: (Deno.env.get("CONTACT_ALLOWED_ORIGINS") ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    async save(message, dedupeKey) {
      const url = Deno.env.get("SUPABASE_URL")
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      if (!url || !serviceRoleKey) throw new Error("Storage unavailable")
      // Server-only credentials. ON CONFLICT DO NOTHING makes retries atomic and
      // preserves the first record without allowing a caller to edit it.
      const response = await fetch(
        `${url}/rest/v1/contact_messages?on_conflict=dedupe_key`,
        {
          method: "POST",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            Prefer: "resolution=ignore-duplicates,return=minimal",
          },
          body: JSON.stringify({ ...message, dedupe_key: dedupeKey }),
          signal: AbortSignal.timeout(10000),
        },
      )
      await response.body?.cancel()
      if (!response.ok) throw new Error("Storage unavailable")
    },
  }),
)
