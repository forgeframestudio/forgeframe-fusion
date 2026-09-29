const ALLOWED_ORIGINS = new Set([
  "https://forgeframestudio.github.io",
  "https://forgeframestudio.github.io/forgeframe-fusion"
]);

function cors(origin) {
  const allowed = origin === "https://forgeframestudio.github.io" ? origin : "https://forgeframestudio.github.io";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

function json(data, status = 200, origin = "") {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors(origin), "Content-Type": "application/json; charset=utf-8" }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (origin && origin !== "https://forgeframestudio.github.io") {
      return json({ error: "Origin not allowed." }, 403, origin);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "ForgeFrame Fusion AI", aiBinding: Boolean(env.AI) }, 200, origin);
    }

    if (request.method !== "POST" || url.pathname !== "/image") {
      return json({ ok: true, service: "ForgeFrame Fusion AI" }, 200, origin);
    }

    if (!env.AI) return json({ error: "Workers AI binding is unavailable." }, 500, origin);

    try {
      const incoming = await request.formData();
      const prompt = String(incoming.get("prompt") || "").trim();
      const image = incoming.get("image");

      if (!prompt) return json({ error: "A prompt is required." }, 400, origin);
      if (prompt.length > 4000) return json({ error: "Prompt is too long." }, 400, origin);
      if (!(image instanceof File)) return json({ error: "A reference image is required." }, 400, origin);
      if (image.size > 12 * 1024 * 1024) return json({ error: "Reference image must be under 12 MB." }, 413, origin);
      if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
        return json({ error: "Reference image must be JPG, PNG, or WebP." }, 400, origin);
      }

      const form = new FormData();
      form.append("prompt", prompt);
      form.append("input_image_0", image, image.name || "reference");
      form.append("width", "1024");
      form.append("height", "1024");

      const serialized = new Response(form);
      const result = await env.AI.run("@cf/black-forest-labs/flux-2-klein-4b", {
        multipart: {
          body: serialized.body,
          contentType: serialized.headers.get("content-type")
        }
      });

      if (!result?.image) return json({ error: "Image model returned no image." }, 502, origin);
      return json({ ok: true, image: result.image, mimeType: "image/png" }, 200, origin);
    } catch (error) {
      return json({ error: "Fusion image generation failed.", detail: error?.message || String(error) }, 500, origin);
    }
  }
};
