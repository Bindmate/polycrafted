// src/app/api/outreach/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { recipients, subject, messageTemplate, attachmentUrl, imageUrl } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    let pdfBuffer: Buffer | null = null;

    // Download the PDF from Supabase into the server's memory ONCE
    if (attachmentUrl && attachmentUrl.startsWith('http')) {
      try {
        const pdfResponse = await fetch(attachmentUrl);
        if (pdfResponse.ok) {
          const arrayBuffer = await pdfResponse.arrayBuffer();
          pdfBuffer = Buffer.from(arrayBuffer);
        } else {
          console.error("Failed to download PDF from the provided URL.");
        }
      } catch (e) {
        console.error("Error fetching attachment:", e);
      }
    }

    let successCount = 0;

    for (const recipient of recipients) {
      // 1. Personalize the text and subject
      const personalizedMessage = messageTemplate.replace(/\[Institution\]/g, recipient.name);
      const personalizedSubject = subject.replace(/\[Institution\]/g, recipient.name); 

      // 2. Convert standard text line breaks to HTML line breaks
      const formattedText = personalizedMessage.replace(/\n/g, '<br/>');

      // 3. Construct the HTML email body, injecting the image if provided
      const htmlBody = `
        <div style="font-family: sans-serif; color: #333; font-size: 14px; line-height: 1.6;">
          ${formattedText}
          
          ${imageUrl ? `
            <br><br>
            <img src="${imageUrl}" alt="Polycrafted Partnership" style="max-width: 100%; height: auto; border-radius: 8px; display: block;" />
          ` : ''}
        </div>
      `;

      const mailOptions: any = {
        from: `"Polycrafted Partnerships" <${process.env.GMAIL_USER}>`,
        to: recipient.email,
        subject: personalizedSubject,
        html: htmlBody, 
      };

      // Attach the downloaded PDF directly to the email
      if (pdfBuffer) {
        mailOptions.attachments = [
          {
            filename: 'Polycrafted_Partnership_Proposal.pdf', 
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ];
      }

      await transporter.sendMail(mailOptions);
      successCount++;
      
      // 1-second pause to protect your Gmail reputation from spam filters
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ success: true, sent: successCount });

  } catch (error: any) {
    console.error("Email Blast Failed:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}