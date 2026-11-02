import { NextRequest, NextResponse } from "next/server";
import { proxyJson } from "../../../auth/_proxy";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ "resume-id": string }> }
) {
  try {
    const { "resume-id": resumeId } = await context.params;

    console.log("[ENHANCE PROXY] Resume ID:", resumeId);

    if (!resumeId || resumeId === "undefined") {
      return NextResponse.json(
        {
          success: false,
          message: "Resume ID is missing.",
        },
        { status: 400 }
      );
    }

    return await proxyJson(
      request,
      `/api/resume-builder/${encodeURIComponent(resumeId)}/enhance`
    );
  } catch (error) {
    console.error("[ENHANCE PROXY ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Resume enhancement proxy failed.",
      },
      { status: 500 }
    );
  }
}