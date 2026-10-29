import { NextRequest } from "next/server";
import { proxyGet } from "../_proxy";
export async function GET(request: NextRequest) { return proxyGet(request, "/api/auth/me"); }
