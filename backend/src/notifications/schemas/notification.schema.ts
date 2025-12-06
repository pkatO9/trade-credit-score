import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: Types.ObjectId, ref: 'Invoice' })
    invoiceId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Contact' })
    contactId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    type: string;

    @Prop()
    message: string;

    @Prop({ default: 'sent' })
    status: string;

    @Prop({ default: Date.now })
    date: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
