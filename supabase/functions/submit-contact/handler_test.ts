import { createHandler, INQUIRY_TYPES } from "./handler.ts"
import { createNotifier } from "./notification.ts"
import { createStorage } from "./storage.ts"

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
      return null
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
        return null
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
      return null
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
      return null
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
    save: async () => null,
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
    save: async () => null,
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

Deno.test("save precedes notification; duplicate skips notification", async () => {
  const calls: string[] = []
  let inserted = false
  const handler = createHandler({
    allowedOrigins: [origin],
    save: async () => {
      calls.push("save")
      if (inserted) return null
      inserted = true
      return { createdAt: "2026-09-18T00:00:00Z" }
    },
    notify: async (row, timestamp, signal) => {
      assert(row.email === "test@example.com")
      assert(timestamp === "2026-09-18T00:00:00Z" && !signal.aborted)
      calls.push("notify")
    },
  })
  for (let i = 0; i < 2; i++) {
    const result = await handler(request(valid))
    assert(result.status === 200 && (await result.json()).success === true)
  }
  assert(calls.join(",") === "save,notify,save")
})

Deno.test("notification failure cannot turn a saved message into Contact failure", async () => {
  const handler = createHandler({
    allowedOrigins: [origin],
    save: async () => ({ createdAt: "2026-09-18T00:00:00Z" }),
    notify: async () => {
      throw new Error("private provider details")
    },
  })
  const result = await handler(request(valid))
  assert(result.status === 200 && (await result.text()) === '{"success":true}')
})

Deno.test("database failure never invokes notification", async () => {
  let calls = 0
  const handler = createHandler({
    allowedOrigins: [origin],
    save: async () => {
      throw new Error("private database details")
    },
    notify: async () => {
      calls++
    },
  })
  const result = await handler(request(valid))
  assert(result.status === 503 && calls === 0)
  assert(!(await result.text()).includes("private"))
})

Deno.test("each missing email setting skips network and preserves success", async () => {
  for (const missing of ["apiKey", "to", "from"]) {
    let saved = false
    let network = 0
    const config: Record<string, string> = {
      apiKey: "test-only",
      to: "team@example.com",
      from: "Site <sender@example.com>",
    }
    delete config[missing]
    const handler = createHandler({
      allowedOrigins: [origin],
      save: async () => {
        saved = true
        return { createdAt: "2026-09-18T00:00:00Z" }
      },
      notify: createNotifier(config, async () => {
        network++
        throw new Error("Must not call")
      }),
    })
    const result = await handler(request(valid))
    assert(result.status === 200 && saved && network === 0)
  }
})

Deno.test("Resend receives plain text, validated reply-to, configured sender and safe subject", async () => {
  let calls = 0
  let checked = false
  const notify = createNotifier(
    {
      apiKey: "test-only",
      to: "team@example.com",
      from: "MOBiLON <sender@example.com>",
    },
    async (url, init) => {
      calls++
      assert(url === "https://api.resend.com/emails" && init?.method === "POST")
      const body = JSON.parse(init.body as string)
      assert(
        body.reply_to === "test@example.com" &&
          body.from === "MOBiLON <sender@example.com>",
      )
      assert(body.to[0] === "team@example.com" && !("html" in body))
      assert(!/[\r\n]/.test(body.subject))
      assert(
        body.text.includes("<script>\"&'</script>") &&
          body.text.includes("Submitted at: 2026-09-18T00:00:00Z"),
      )
      checked = true
      return new Response('{"id":"test"}', { status: 200 })
    },
  )
  const handler = createHandler({
    allowedOrigins: [origin],
    save: async () => ({ createdAt: "2026-09-18T00:00:00Z" }),
    notify,
  })
  assert(
    (
      await handler(
        request({
          ...valid,
          name: "Test\r\nPerson",
          message: "<script>\"&'</script>",
        }),
      )
    ).status === 200,
  )
  assert(calls === 1 && checked)
})

Deno.test("Resend HTTP errors and timeouts preserve database success", async () => {
  for (const mode of ["http", "timeout"]) {
    const notify = createNotifier(
      {
        apiKey: "test-only",
        to: "team@example.com",
        from: "sender@example.com",
      },
      async (_url, init) => {
        if (mode === "http")
          return new Response("private provider response", { status: 429 })
        return await new Promise<Response>((_resolve, reject) => {
          init!.signal!.addEventListener(
            "abort",
            () => reject(new Error("timeout")),
            { once: true },
          )
        })
      },
    )
    const handler = createHandler({
      allowedOrigins: [origin],
      save: async () => ({ createdAt: "2026-09-18T00:00:00Z" }),
      notify,
    })
    const start = performance.now()
    const result = await handler(request(valid))
    assert(
      result.status === 200 && (await result.text()) === '{"success":true}',
    )
    assert(performance.now() - start < 6500)
  }
})

Deno.test("storage representation distinguishes new row and conflict without client ID", async () => {
  for (const rows of [[{ created_at: "2026-09-18T00:00:00Z" }], []]) {
    const save = createStorage(
      "https://example.supabase.co",
      "test-only",
      async (url, init) => {
        assert(String(url).endsWith("on_conflict=dedupe_key&select=created_at"))
        assert(
          new Headers(init?.headers).get("Prefer") ===
            "resolution=ignore-duplicates,return=representation",
        )
        const body = JSON.parse(init?.body as string)
        assert(
          body.dedupe_key === "test-dedupe" &&
            !("id" in body) &&
            !("created_at" in body),
        )
        return new Response(JSON.stringify(rows), { status: 201 })
      },
    )
    const result = await save(
      {
        name: "Test",
        email: "test@example.com",
        organisation: null,
        inquiry_type: "Collaborations",
        message: "Test message",
      },
      "test-dedupe",
    )
    assert(
      rows.length ? result?.createdAt === rows[0].created_at : result === null,
    )
  }
})

const notificationRecipients = [
  "mobilon.bu@bennett.edu.in",
  "s25cseu1244@bennett.edu.in",
]

for (const [label, to] of [
  ["two recipients", "mobilon.bu@bennett.edu.in,s25cseu1244@bennett.edu.in"],
  ["whitespace", " mobilon.bu@bennett.edu.in, s25cseu1244@bennett.edu.in "],
  ["empty entries", "mobilon.bu@bennett.edu.in,, ,s25cseu1244@bennett.edu.in,"],
]) {
  Deno.test(`recipient list: ${label} uses one request with both addresses`, async () => {
    const payloads: Record<string, unknown>[] = []
    const handler = createHandler({
      allowedOrigins: [origin],
      save: async () => ({ createdAt: "2026-09-18T00:00:00Z" }),
      notify: createNotifier(
        { apiKey: "test-only", from: "Site <sender@example.com>", to },
        async (_url, init) => {
          payloads.push(JSON.parse(init!.body as string))
          return new Response('{"id":"test"}')
        },
      ),
    })
    const result = await handler(request(valid))
    assert(result.status === 200 && (await result.json()).success === true)
    assert(payloads.length === 1)
    assert(
      JSON.stringify(payloads[0].to) === JSON.stringify(notificationRecipients),
    )
    assert(payloads[0].reply_to === "test@example.com")
    assert(payloads[0].from === "Site <sender@example.com>")
  })
}

Deno.test("empty recipient lists skip notification and preserve saved Contact success", async () => {
  for (const to of [undefined, "", "   ", ", ,,, "]) {
    let saves = 0
    let network = 0
    const handler = createHandler({
      allowedOrigins: [origin],
      save: async () => {
        saves++
        return { createdAt: "2026-09-18T00:00:00Z" }
      },
      notify: createNotifier(
        { apiKey: "test-only", from: "sender@example.com", to },
        async () => {
          network++
          throw new Error("Network must not be used")
        },
      ),
    })
    const result = await handler(request(valid))
    assert(result.status === 200 && (await result.json()).success === true)
    assert(saves === 1 && network === 0)
  }
})

Deno.test("duplicate saves one row and sends one Resend request containing both recipients", async () => {
  const storedKeys = new Set<string>()
  const payloads: Record<string, unknown>[] = []
  let inserts = 0
  const handler = createHandler({
    allowedOrigins: [origin],
    now: () => 60000,
    save: async (_message, key) => {
      if (storedKeys.has(key)) return null
      storedKeys.add(key)
      inserts++
      return { createdAt: "2026-09-18T00:00:00Z" }
    },
    notify: createNotifier(
      {
        apiKey: "test-only",
        from: "sender@example.com",
        to: notificationRecipients.join(","),
      },
      async (_url, init) => {
        payloads.push(JSON.parse(init!.body as string))
        return new Response('{"id":"test"}')
      },
    ),
  })
  const results = await Promise.all([
    handler(request(valid)),
    handler(request(valid)),
  ])
  for (const result of results)
    assert(result.status === 200 && (await result.json()).success === true)
  assert(inserts === 1 && storedKeys.size === 1 && payloads.length === 1)
  assert(
    JSON.stringify(payloads[0].to) === JSON.stringify(notificationRecipients),
  )
  assert(payloads[0].reply_to === "test@example.com")
})
