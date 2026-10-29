
import { NextRequest } from "next/server";
import { proxyMultipart } from "../../auth/_proxy";

export async function POST(request: NextRequest) {
  return proxyMultipart(request, "/api/resume/analyze");
}
