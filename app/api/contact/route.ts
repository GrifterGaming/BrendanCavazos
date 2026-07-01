import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/verifyRecaptcha";
import { sendContactEmail } from "@/lib/sendContactEmail";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  console.log("[api/contact] start");

  try {
    const { name, email, phone, message, projectTypes, captchaToken, honeypot } = await req.json();

    // Bots that auto-fill every field land here — fake success, no email sent.
    if (honeypot) {
      console.log("[api/contact] end — honeypot triggered, dropped silently");
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !message) {
      console.log("[api/contact] end — missing fields");
      return NextResponse.json({ ok: false, error: "Please fill in all fields." }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      console.log("[api/contact] end — invalid email format");
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!captchaToken) {
      console.log("[api/contact] end — missing captcha token");
      return NextResponse.json({ ok: false, error: "Please complete the reCAPTCHA." }, { status: 400 });
    }

    const captchaOk = await verifyRecaptcha(captchaToken);
    if (!captchaOk) {
      console.log("[api/contact] end — captcha verification failed");
      return NextResponse.json(
        { ok: false, error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    const safePhone = typeof phone === "string" ? phone.trim() : "";
    const safeProjectTypes = Array.isArray(projectTypes)
      ? projectTypes.filter((t): t is string => typeof t === "string" && t.length > 0)
      : [];

    await sendContactEmail({ name, email, phone: safePhone, message, projectTypes: safeProjectTypes });

    console.log("[api/contact] end — email sent");
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.log("[api/contact] end — error:", err?.message);
    return NextResponse.json(
      { ok: false, error: err?.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
