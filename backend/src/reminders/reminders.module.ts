import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { RemindersProcessor } from './reminders.processor';
import { Invoice, InvoiceSchema } from '../invoices/schemas/invoice.schema';
import { Notification, NotificationSchema } from '../notifications/schemas/notification.schema';
import { Contact, ContactSchema } from '../contacts/schemas/contact.schema';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'reminders',
        }),
        MongooseModule.forFeature([
            { name: Invoice.name, schema: InvoiceSchema },
            { name: Notification.name, schema: NotificationSchema },
            { name: Contact.name, schema: ContactSchema },
        ]),
    ],
    providers: [RemindersProcessor],
    exports: [BullModule],
})
export class RemindersModule { }
