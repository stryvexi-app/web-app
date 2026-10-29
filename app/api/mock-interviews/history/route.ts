import { NextRequest } from "next/server";
import { proxyJson } from "../../auth/_proxy";

export async function GET(request: NextRequest) {
  return proxyJson(request, "/api/mock-interviews/history");
}