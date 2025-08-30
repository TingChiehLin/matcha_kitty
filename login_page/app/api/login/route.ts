/*
import { NextResponse } from "next/server";
import { findStudentByEmailAndCode } from "@/lib/students";

import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ ok: false, error: "Missing email or code" }, { status: 400 });
    }

    const student = await findStudentByEmailAndCode(email, code);
    if (!student) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }


    cookies().set("student_session", JSON.stringify({
      id: student.id, name: student.name, email: student.email
    }), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8 
    });

    return NextResponse.json({ ok: true, student: { id: student.id, name: student.name } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
*/