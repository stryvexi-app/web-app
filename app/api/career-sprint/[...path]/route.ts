import { NextRequest } from "next/server";
import { proxyJson } from "../../auth/_proxy";

function getBackendPath(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const endpoint = pathname.replace(
    /^\/api\/career-sprint\//,
    ""
  );

  return `/api/career-sprint/${endpoint}`;
}

export async function GET(request: NextRequest) {
  return proxyJson(request, getBackendPath(request));
}

export async function POST(request: NextRequest) {
  return proxyJson(request, getBackendPath(request));
}