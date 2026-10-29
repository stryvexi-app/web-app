import { console } from "inspector";
import { NextRequest, NextResponse } from "next/server";

const backend = process.env.AUTH_BACKEND_URL;

function unavailable() {
  return NextResponse.json({ message: "AUTH_BACKEND_URL is not configured." }, { status: 500 });
}
async function relay(upstream: Response) {
  const body = await upstream.text();
  const response = new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" },
  });
  const cookie = upstream.headers.get("set-cookie");
  if (cookie) response.headers.set("set-cookie", cookie);
  return response;
}
export async function proxyJson(request: NextRequest, endpoint: string) {
  console.log("hellooooooooo")
  if (!backend) return unavailable();
  try {
    const body = await request.text();
    const upstream = await fetch(`${backend}${endpoint}`, {
      method: request.method,
      headers: {
                "Content-Type": "application/json",
                cookie: request.headers.get("cookie") || "",
              },
      body: body || undefined,
      cache: "no-store",
    });
    return await relay(upstream);
  } catch {
    return NextResponse.json({ message: "Authentication service is unavailable." }, { status: 502 });
  }
}

export async function proxyMultipart(
  request: NextRequest,
  endpoint: string
) {
  if (!backend) return unavailable();

  try {
    const form = await request.formData();

    const upstream = await fetch(`${backend}${endpoint}`, {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      body: form,
      cache: "no-store",
    });

    return await relay(upstream);
  } catch {
    return NextResponse.json(
      { message: "Resume analysis service is unavailable." },
      { status: 502 }
    );
  }
}

export async function proxyGet(request: NextRequest, endpoint: string) {
  if (!backend) return unavailable();
  try {
    const upstream = await fetch(`${backend}${endpoint}`, {
      headers: { cookie: request.headers.get("cookie") || "" },
      cache: "no-store",
    });
    return await relay(upstream);
  } catch {
    return NextResponse.json({ message: "Authentication service is unavailable." }, { status: 502 });
  }
}
