import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { PaymentsModule } from '../payments/payments.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
        PaymentsModule,
    ],
    controllers: [InvoicesController],
    providers: [InvoicesService],
})
export class InvoicesModule { }
