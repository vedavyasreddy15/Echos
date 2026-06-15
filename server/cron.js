import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Capsule from './models/Capsule.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your gmail address
    pass: process.env.EMAIL_PASS  // your Google App Password
  }
});

export const processDueCapsules = async () => {
  console.log('⏳ Running virtual capsule check...');
  try {
    const now = new Date();
    
    // Find all pending virtual capsules
    const pendingCapsules = await Capsule.find({
      status: 'pending',
      deliveryType: 'virtual'
    });

    const dueCapsules = pendingCapsules.filter(capsule => {
      const capsuleDate = new Date(capsule.deliveryDate);
      const [hours, minutes] = (capsule.deliveryTime || '12:00').split(':').map(Number);
      capsuleDate.setHours(hours, minutes, 0, 0);
      return now >= capsuleDate;
    });

    console.log(`Found ${dueCapsules.length} virtual capsules due for delivery.`);

    let sentCount = 0;
    for (const capsule of dueCapsules) {
      if (!capsule.recipientDetails.email) continue;

      const htmlEmail = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #fdf5e6; border: 1px solid #f1e0c6; border-radius: 12px;">
          <h1 style="color: #c1121f; margin-bottom: 10px; text-align: center;">Echos Time Capsule Delivered</h1>
          
          <div style="background: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center;">
            <h2 style="color: #333; margin-top: 0; font-size: 24px;">You have received a Time Capsule</h2>
            <p style="font-family: sans-serif; color: #555; line-height: 1.6; font-size: 16px;">
              <strong>${capsule.senderName}</strong> sealed this message for you in the past, scheduling it to arrive at this exact moment.
            </p>
            
            <div style="margin: 40px 0; padding: 30px; background: #fffcf7; border-left: 4px solid #c1121f; font-size: 18px; color: #333; font-style: italic; text-align: left; white-space: pre-wrap; line-height: 1.8;">"${capsule.letter}"</div>
            
            ${capsule.files.length > 0 ? `
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee; text-align: left;">
                <h3 style="margin-top: 0; color: #444; font-size: 16px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px;">📎 Attached Memories (${capsule.files.length})</h3>
                <p style="font-family: sans-serif; color: #666; font-size: 14px; margin-bottom: 15px;">
                  Click the secure links below to download the original photos, videos, and files directly to your device.
                </p>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  ${capsule.files.map(file => {
                    const apiUrl = process.env.API_URL || 'http://localhost:3001';
                    return `
                    <a href="${apiUrl}/api/capsules/public/download/${file.fileId}" style="display: inline-block; padding: 12px 20px; background: #c1121f; color: #fff; text-decoration: none; border-radius: 6px; font-family: sans-serif; font-weight: bold; text-align: center; margin-bottom: 8px;">
                      Download ${file.originalName}
                    </a>
                  `;}).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-family: sans-serif; color: #aaa; font-size: 12px;">
            Sent via Echos - Preserve Your Legacy.<br/>
            Receipt Number: ${capsule.receiptNumber || 'LEGACY'}
          </div>
        </div>
      `;

      try {
        const vercelDomain = process.env.VERCEL_URL || 'echos-admin.vercel.app';
        const relayUrl = vercelDomain.startsWith('http') ? `${vercelDomain}/api/send-email` : `https://${vercelDomain}/api/send-email`;
        
        const relayResponse = await fetch(relayUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: capsule.recipientDetails.email,
            subject: `A Time Capsule from ${capsule.senderName} has arrived.`,
            html: htmlEmail
          })
        });

        if (!relayResponse.ok) {
           const errText = await relayResponse.text();
           throw new Error(`Relay returned ${relayResponse.status}: ${errText}`);
        }

        capsule.status = 'delivered';
        await capsule.save();
        sentCount++;
        console.log(`✅ Capsule successfully sent to ${capsule.recipientDetails.email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${capsule.recipientDetails.email}:`, emailError.message);
      }
    }
    return sentCount;
  } catch (error) {
    console.error('❌ Error during cron job execution:', error);
    throw error;
  }
};

export const initCronJob = () => {
  cron.schedule('* * * * *', async () => {
    await processDueCapsules();
  });
  console.log('🕒 Automated Gmail delivery worker initialized.');
};
