import { NextRequest, NextResponse } from "next/server";
import { proxyJson } from "../../auth/_proxy";

type RouteContext = {
  params: Promise<{
    "resume-id": string;
  }>;
};

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { "resume-id": resumeId } = await context.params;

    console.log("[RESUME SAVE PROXY] Resume ID:", resumeId);

    if (!resumeId) {
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
      `/api/resume-builder/${encodeURIComponent(resumeId)}`
    );
  } catch (error) {
    console.error("[RESUME SAVE PROXY ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save resume.",
      },
      { status: 500 }
    );
  }
}