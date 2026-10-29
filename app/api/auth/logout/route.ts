import { NextRequest } from "next/server";
import { proxyJson } from "../_proxy";
export async function POST(request: NextRequest) { return proxyJson(request, "/api/auth/logout"); }
