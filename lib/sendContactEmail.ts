import { Resend } from "resend";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  projectTypes?: string[];
};

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    throw new Error("Email service is not configured.");
  }

  const resend = new Resend(apiKey);

  // Strip header-breaking characters before using the visitor's name in email headers.
  const safeName = payload.name.replace(/[\r\n<>"]/g, "").trim();

  const projectTypesLine = payload.projectTypes?.length
    ? `Interested In: ${payload.projectTypes.join(", ")}\n`
    : "";
  const phoneLine = payload.phone ? `Phone: ${payload.phone}\n` : "";

  const subject = `Project Request from ${safeName}`;

  const { error } = await resend.emails.send({
    from: `${safeName} (via Portfolio Site) <bc@brendancavazos.com>`,
    to: toEmail,
    replyTo: payload.email,
    subject,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\n${phoneLine}${projectTypesLine}\nMessage:\n${payload.message}`,
  });

  if (error) {
    throw new Error(error.message || "Resend failed to send the email.");
  }
}
