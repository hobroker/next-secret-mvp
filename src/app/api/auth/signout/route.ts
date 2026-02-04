import { NextResponse } from "next/server";
import { signOut } from "next-auth/react";

export async function POST() {
  // With App Router, signOut is typically used client-side.
  // For simplicity in this MVP, this endpoint just redirects to home.
  return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL ?? "http://localhost:3000"));
}
