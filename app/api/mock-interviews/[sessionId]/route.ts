import { NextRequest } from "next/server";
import { proxyGet } from "../../auth/_proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  return proxyGet(
    request,
    `/api/mock-interviews/${encodeURIComponent(sessionId)}`
  );
}