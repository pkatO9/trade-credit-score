import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    ) { }

    async create(createPaymentDto: CreatePaymentDto, invoiceId: string): Promise<Payment> {
        const newPayment = new this.paymentModel({
            ...createPaymentDto,
            invoiceId,
        });
        return newPayment.save();
    }
}
