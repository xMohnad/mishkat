import { API_URL } from "@/lib/api";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string; filename: string }>;
}

/**
 * Proxies file downloads to hide the backend URL and control response headers.
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { id, filename } = await params;

  const range = request.headers.get("range");

  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/file/${id}/${encodeURIComponent(filename)}`, {
      cache: "no-store",
      headers: range ? { range } : undefined,
    });
  } catch {
    return Response.json({ error: "Upstream service unreachable." }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    let message = "Could not fetch the file.";
    try {
      const body = await upstream.json();
      if (typeof body?.detail === "string") message = body.detail;
    } catch {
      // upstream didn't return JSON, keep default message
    }
    return Response.json({ error: message }, { status: upstream.status || 502 });
  }

  // Whitelist only the headers a download needs — never forward the upstream response as-is.
  const headers = new Headers({
    "content-type": upstream.headers.get("content-type") ?? "application/octet-stream",
    "content-disposition": upstream.headers.get("content-disposition") ?? `attachment; filename="${filename}"`,
    "cache-control": "private, no-store",
    "accept-ranges": upstream.headers.get("accept-ranges") ?? "bytes",
  });

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("content-length", contentLength);

  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("content-range", contentRange);

  return new Response(upstream.body, {
    status: upstream.status, // 200 or 206
    headers,
  });
}
