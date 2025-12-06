import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact, ContactDocument } from '../contacts/schemas/contact.schema';
import { Invoice, InvoiceDocument } from '../invoices/schemas/invoice.schema';

import { Notification, NotificationDocument } from '../notifications/schemas/notification.schema';

@Injectable()
export class JobsService {
    constructor(
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
        @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) { }

    async listNotifications(userId: string): Promise<Notification[]> {
        return this.notificationModel.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    async computeTrust(userId: string): Promise<any> {
        const contacts = await this.contactModel.find({ userId: new Types.ObjectId(userId) }).exec();
        const results: any[] = [];

        for (const contact of contacts) {
            const invoices = await this.invoiceModel.find({
                buyerId: contact._id,
                sellerId: new Types.ObjectId(userId),
                status: { $in: ['paid', 'overdue', 'partially_paid'] } // Only consider actionable invoices
            }).exec();

            if (invoices.length === 0) {
                continue;
            }

            let totalDelayDays = 0;
            let onTimeCount = 0;
            let overdueCount = 0;

            for (const invoice of invoices) {
                // Calculate delay logic
                let delay = 0;
                const targetDate = invoice.paidAt || new Date(); // If not paid, use now to penalize current delay

                if (invoice.dueDate && targetDate > invoice.dueDate) {
                    const diffTime = Math.abs(targetDate.getTime() - invoice.dueDate.getTime());
                    delay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }

                totalDelayDays += delay;

                if (delay <= 0) {
                    onTimeCount++;
                }

                if (invoice.status === 'overdue' || (invoice.status === 'paid' && delay > 0)) {
                    // Logic refinement: overdue means currently overdue OR it was paid late
                    // But simple metric "overdueCount" usually means how many *currently* or *historically* flagged?
                    // Prompt says: "overdueCount". Let's count current overdue or late payments.
                    overdueCount++; // Counting anything not strictly on time effectively
                }
            }

            const totalInvoices = invoices.length;
            const onTimePercent = (onTimeCount / totalInvoices) * 100;
            const avgDelayDays = totalDelayDays / totalInvoices;

            // Rule: score = 80 + (onTime% - 80) * 0.5 - min(avgDelayDays, 30)*0.5
            // onTimePercent is 0-100.
            let trustScore = 80 + (onTimePercent - 80) * 0.5 - Math.min(avgDelayDays, 30) * 0.5;
            trustScore = Math.max(0, Math.min(100, trustScore)); // Clamp 0-100

            contact.stats = {
                onTimePercent,
                avgDelayDays,
                totalInvoices,
                overdueCount
            };
            contact.trustScore = Math.round(trustScore);

            await contact.save();
            results.push({ contactId: contact._id, trustScore: contact.trustScore });
        }

        return { processed: contacts.length, details: results };
    }
}
