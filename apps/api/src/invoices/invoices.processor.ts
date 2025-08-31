import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import sendgrid from '@sendgrid/mail';
import Twilio from 'twilio';

@Processor('notifications')
export class InvoicesProcessor extends WorkerHost {
  async process(job: Job) {
    const { type, payload } = job.data;
    if (type === 'invoice.created') {
      // SendGrid
      if (process.env.SENDGRID_API_KEY) {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
        await sendgrid.send({
          to: payload.emailTo || 'owner@example.com',
          from: process.env.EMAIL_FROM!,
          subject: `New invoice ${payload.invoice.id}`,
          text: `Amount: ${payload.invoice.amount}`
        });
      }
      // Twilio
      if (process.env.TWILIO_ACCOUNT_SID) {
        const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
        await client.messages.create({
          body: `New invoice ${payload.invoice.id}`,
          from: process.env.TWILIO_FROM!,
          to: payload.smsTo || '+10000000000'
        });
      }
    }
    return true;
  }
}
