
import { NextRequest } from "next/server";
import { proxyJson } from "../auth/_proxy";

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  return proxyJson(request, "/api/profile");
}
