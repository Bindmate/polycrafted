import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { recipients, subject, messageTemplate } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    let successCount = 0;

    for (const recipient of recipients) {
      // 1. Personalize the text and subject
      const personalizedMessage = messageTemplate.replace(/\[Institution\]/g, recipient.name);
      const personalizedSubject = subject.replace(/\[Institution\]/g, recipient.name); 

      // 2. Convert standard text line breaks to HTML line breaks
      const formattedText = personalizedMessage.replace(/\n/g, '<br/>');

      // 3. Construct the HTML email body with the Professional Signature
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; color: #333; font-size: 14px; line-height: 1.6;">
          ${formattedText}
          
          <br><br><br>
          
          <table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Georgia', serif; max-width: 600px;">
            <tr>
              <td valign="top" style="text-align: center; width: 110px; padding-right: 15px;">
                
                <img src="https://mqtbsctjeydlqlsjpuio.supabase.co/storage/v1/object/public/Proposals/polycrafted%20doodle%20(3).png" alt="Polycrafted Logo" width="85" style="display: block; margin: 0 auto 8px auto; border: none;" />
                
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                  <tr>
                    <td style="padding: 0 4px;">
                      <a href="https://www.facebook.com/profile.php?id=61565346441145" target="_blank">
                        <img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" width="22" alt="Facebook" style="display: block; border: none;" />
                      </a>
                    </td>
                    <td style="padding: 0 4px;">
                      <a href="https://instagram.com/your-polycrafted-page" target="_blank">
                        <img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" width="22" alt="Instagram" style="display: block; border: none;" />
                      </a>
                    </td>
                    <td style="padding: 0 4px;">
                      <a href="https://tiktok.com/@your-polycrafted-page" target="_blank">
                        <img src="https://img.icons8.com/ios-filled/50/000000/tiktok.png" width="22" alt="TikTok" style="display: block; border: none;" />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>

              <td valign="top" style="padding-left: 15px;">
                <div style="font-size: 17px; font-weight: bold; color: #D4537E; letter-spacing: 0.5px; text-transform: uppercase;">
                  NICHOLAS QUINTELA
                </div>
                <div style="font-size: 15px; font-style: italic; color: #000; margin-top: 2px; margin-bottom: 8px;">
                  Partnerships and Promotions Officer
                </div>
                
                <div style="border-top: 1.5px solid #D4537E; width: 100%; margin-bottom: 10px;"></div>

                <div style="font-size: 14px; color: #000; line-height: 1.6; font-family: Arial, sans-serif;">
                  (+63) 9948565485<br/>
                  <a href="mailto:partnershipspolycrafted@gmail.com" style="color: #D4537E; text-decoration: underline;">partnershipspolycrafted@gmail.com</a>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `;

      const mailOptions: any = {
        from: `"Polycrafted Partnerships" <${process.env.GMAIL_USER}>`,
        to: recipient.email,
        subject: personalizedSubject,
        html: htmlBody,
      };

      await transporter.sendMail(mailOptions);
      successCount++;
      
      // 3-minute pause (180,000 milliseconds) to protect your Gmail reputation from spam filters
      await new Promise(resolve => setTimeout(resolve, 180000));
    }

    return NextResponse.json({ success: true, sent: successCount });

  } catch (error: any) {
    console.error("Email Blast Failed:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}