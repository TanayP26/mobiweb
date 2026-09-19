import { createHandler } from "./handler.ts"
import { createNotifier } from "./notification.ts"
import { createStorage } from "./storage.ts"

Deno.serve(
  createHandler({
    allowedOrigins: (Deno.env.get("CONTACT_ALLOWED_ORIGINS") ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    save: createStorage(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    ),
    notify: createNotifier({
      apiKey: Deno.env.get("RESEND_API_KEY"),
      to: Deno.env.get("CONTACT_NOTIFICATION_TO"),
      from: Deno.env.get("CONTACT_EMAIL_FROM"),
    }),
  }),
)
