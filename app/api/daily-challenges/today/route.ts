import { NextRequest } from "next/server";
import { proxyGet } from "../../auth/_proxy";

export async function GET(request: NextRequest) {
  return proxyGet(request, "/api/daily-challenges/today");
}
