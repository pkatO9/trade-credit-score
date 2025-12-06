import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class InvoiceItem {
    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    rate: number;
}

@Schema({ timestamps: true })
export class Invoice {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sellerId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Contact', required: true })
    buyerId: Types.ObjectId;

    @Prop({ type: [SchemaFactory.createForClass(InvoiceItem)], required: true })
    items: InvoiceItem[];

    @Prop({ default: Date.now })
    invoiceDate: Date;

    @Prop()
    dueDate: Date;

    @Prop()
    paidAt: Date;

    @Prop()
    dueDays: number;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true })
    outstandingAmount: number;

    @Prop({ default: 'pending', enum: ['pending', 'partially_paid', 'paid', 'overdue', 'cancelled'] })
    status: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
