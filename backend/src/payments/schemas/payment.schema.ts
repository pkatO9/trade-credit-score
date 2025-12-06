import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: Types.ObjectId, ref: 'Invoice', required: true })
    invoiceId: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    mode: string;

    @Prop({ required: true })
    date: Date;

    @Prop()
    txRef: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
