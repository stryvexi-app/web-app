import { NextRequest } from "next/server";
import { proxyMultipart } from "../_proxy";
export const runtime = "nodejs";
export async function POST(request: NextRequest) { return proxyMultipart(request, "/api/auth/register"); }
