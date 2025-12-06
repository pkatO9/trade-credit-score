import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PaymentsService } from '../payments/payments.service';
import { CreatePaymentDto } from '../payments/dto/create-payment.dto';

@Injectable()
export class InvoicesService {
    constructor(
        @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
        private readonly paymentsService: PaymentsService,
    ) { }

    async create(createInvoiceDto: CreateInvoiceDto, sellerId: string): Promise<Invoice> {
        const totalAmount = createInvoiceDto.items.reduce(
            (sum, item) => sum + item.quantity * item.rate,
            0,
        );

        let dueDate = createInvoiceDto.dueDate ? new Date(createInvoiceDto.dueDate) : undefined;
        if (!dueDate && createInvoiceDto.dueDays) {
            dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + createInvoiceDto.dueDays);
        }

        const newInvoice = new this.invoiceModel({
            ...createInvoiceDto,
            sellerId: new Types.ObjectId(sellerId),
            buyerId: new Types.ObjectId(createInvoiceDto.buyerId),
            totalAmount,
            outstandingAmount: totalAmount,
            dueDate,
            status: 'pending',
        });

        return newInvoice.save();
    }

    async findAll(sellerId: string): Promise<Invoice[]> {
        return this.invoiceModel
            .find({ sellerId: new Types.ObjectId(sellerId) })
            .populate('buyerId', 'name')
            .exec();
    }

    async findOne(id: string, sellerId: string): Promise<InvoiceDocument> {
        const invoice = await this.invoiceModel.findOne({
            _id: id,
            sellerId: new Types.ObjectId(sellerId),
        }).populate('buyerId', 'name').exec();

        if (!invoice) {
            throw new NotFoundException(`Invoice #${id} not found`);
        }
        return invoice;
    }

    async addPayment(id: string, sellerId: string, createPaymentDto: CreatePaymentDto): Promise<InvoiceDocument> {
        const invoice = await this.findOne(id, sellerId);

        // Create payment record
        await this.paymentsService.create(createPaymentDto, id);

        // Update invoice
        invoice.outstandingAmount -= createPaymentDto.amount;
        if (invoice.outstandingAmount <= 0) {
            invoice.outstandingAmount = 0;
            invoice.status = 'paid';
            invoice.paidAt = new Date();
        } else {
            invoice.status = 'partially_paid';
        }

        return invoice.save();
    }
}
