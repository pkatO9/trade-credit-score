import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
    constructor(
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    ) { }

    async create(createContactDto: CreateContactDto, userId: string): Promise<Contact> {
        const newContact = new this.contactModel({
            ...createContactDto,
            userId: new Types.ObjectId(userId),
        });
        return newContact.save();
    }

    async findAll(userId: string): Promise<Contact[]> {
        return this.contactModel.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    async findOne(id: string, userId: string): Promise<Contact> {
        const contact = await this.contactModel.findOne({
            _id: id,
            userId: new Types.ObjectId(userId),
        }).exec();

        if (!contact) {
            throw new NotFoundException(`Contact #${id} not found`);
        }
        return contact;
    }

    async update(id: string, userId: string, updateContactDto: UpdateContactDto): Promise<Contact> {
        const contact = await this.contactModel.findOneAndUpdate(
            { _id: id, userId: new Types.ObjectId(userId) },
            updateContactDto,
            { new: true },
        ).exec();

        if (!contact) {
            throw new NotFoundException(`Contact #${id} not found`);
        }
        return contact;
    }

    async remove(id: string, userId: string): Promise<Contact> {
        const contact = await this.contactModel.findOneAndDelete({
            _id: id,
            userId: new Types.ObjectId(userId),
        }).exec();

        if (!contact) {
            throw new NotFoundException(`Contact #${id} not found`);
        }
        return contact;
    }
}
