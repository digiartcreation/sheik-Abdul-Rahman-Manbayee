import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors";

export const ok = (data, message = "OK", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });

export const paged = (content, page, size, totalElements) =>
  ok({ content, page, size, totalElements, totalPages: Math.ceil(totalElements / size) });

export const noContent = () => new NextResponse(null, { status: 204 });

export function fail(error) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: error.flatten() },
      { status: 400 }
    );
  }
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, message: error.message, errors: error.errors ?? [] },
      { status: error.status }
    );
  }
  console.error(error);
  return NextResponse.json(
    { success: false, message: "Internal server error", errors: [] },
    { status: 500 }
  );
}
