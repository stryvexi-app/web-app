import { NextRequest, NextResponse } from "next/server";
import { proxyJson } from "../../auth/_proxy";

export async function POST(request: NextRequest) {
  console.log("Next.js: received mock interview start request");

  const response = await proxyJson(
    request,
    "/api/mock-interviews/start"
  );

  console.log(
    "Next.js: mock interview proxy response",
    response.status
  );

  return response;
}