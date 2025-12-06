import {
    Body,
    Controller,
    Get,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/v1/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req: any) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Put('me')
    async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
        // req.user is populated by JwtStrategy, and it is the User document/object
        // In JwtStrategy.validate(), we return the full user object.
        // However, depending on Mongoose version, _id might be an object or string.
        // Let's assume req.user._id is accessible.
        const userId = req.user._id;
        return this.usersService.update(userId, updateUserDto);
    }
}
