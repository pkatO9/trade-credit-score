import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceDocument } from '../invoices/schemas/invoice.schema';
import { Notification, NotificationDocument } from '../notifications/schemas/notification.schema';
import { Contact, ContactDocument } from '../contacts/schemas/contact.schema';

@Processor('reminders')
export class RemindersProcessor {
    constructor(
        @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    ) { }

    @Process('send-due')
    async handleSendDueReminders(job: Job) {
        const { userId } = job.data;
        console.log(`Processing send-due-reminders for user ${userId}`);

        // Logic: Find invoices due tomorrow or overdue, connected to this user (seller)
        // For simplicity, let's just picking invoices due tomorrow or earlier that are not paid.
        // In a real app, complex logic needed to avoid spamming.
        // Here, we'll just check for pending/partially_paid and dueDate <= tomorrow.

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const invoices = await this.invoiceModel.find({
            sellerId: new Types.ObjectId(userId),
            status: { $in: ['pending', 'partially_paid'] },
            dueDate: { $lte: tomorrow },
        }).populate('buyerId').exec();

        console.log(`Found ${invoices.length} due invoices`);

        for (const invoice of invoices) {
            // Simulate sending logic
            const buyer = invoice.buyerId as any; // Populated
            const message = `Reminder: Invoice ${invoice._id} for amount ${invoice.outstandingAmount} is due on ${invoice.dueDate}`;

            console.log(`Sending reminder to ${buyer.name} (${buyer.phone}): ${message}`);

            // Create Notification
            const notification = new this.notificationModel({
                invoiceId: invoice._id,
                contactId: buyer._id,
                userId: new Types.ObjectId(userId),
                type: 'reminder',
                message: message,
                status: 'sent',
            });
            await notification.save();
        }
    }
}
