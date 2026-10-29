import { NextRequest } from "next/server";
import { proxyJson } from "../../auth/_proxy";

export async function POST(request: NextRequest) {
  return proxyJson(request, "/api/daily-challenges/submit");
}
