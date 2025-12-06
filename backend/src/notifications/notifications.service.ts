import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) { }

    async findAll(userId: string): Promise<Notification[]> {
        return this.notificationModel
            .find({ userId: new Types.ObjectId(userId) })
            .sort({ date: -1 })
            .populate('invoiceId', 'totalAmount outstandingAmount status dueDate')
            .populate('contactId', 'name')
            .exec();
    }
}
