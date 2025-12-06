import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Contact, ContactSchema } from '../contacts/schemas/contact.schema';
import { Invoice, InvoiceSchema } from '../invoices/schemas/invoice.schema';
import { Notification, NotificationSchema } from '../notifications/schemas/notification.schema';

import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Contact.name, schema: ContactSchema },
            { name: Invoice.name, schema: InvoiceSchema },
            { name: Notification.name, schema: NotificationSchema },
        ]),
        BullModule.registerQueue({
            name: 'reminders',
        }),
    ],
    controllers: [JobsController],
    providers: [JobsService],
})
export class JobsModule { }
