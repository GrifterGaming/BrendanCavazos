import { Resend } from "resend";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    throw new Error("Email service is not configured.");
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Portfolio Contact Form <onboarding@resend.dev>",
    to: toEmail,
    replyTo: payload.email,
    subject: "Portfolio Inquiry from " + payload.name,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`,
  });

  if (error) {
    throw new Error(error.message || "Resend failed to send the email.");
  }
}
