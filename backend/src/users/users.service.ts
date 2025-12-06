import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(phone: string): Promise<User> {
        const newUser = new this.userModel({ phone });
        return newUser.save();
    }

    async findByPhone(phone: string): Promise<User | null> {
        return this.userModel.findOne({ phone }).exec();
    }

    async update(id: string, updateUserDto: any): Promise<User | null> {
        return this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
    }
}
