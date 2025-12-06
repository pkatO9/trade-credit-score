import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    email: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({
        type: {
            onTimePercent: { type: Number, default: 0 },
            avgDelayDays: { type: Number, default: 0 },
            totalInvoices: { type: Number, default: 0 },
            overdueCount: { type: Number, default: 0 },
        },
        default: {},
    })
    stats: {
        onTimePercent: number;
        avgDelayDays: number;
        totalInvoices: number;
        overdueCount: number;
    };

    @Prop({ default: 0 })
    trustScore: number;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
