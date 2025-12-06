import {
    Body,
    Controller,
    Get,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('api/v1/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getProfile(@Request() req: any) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Put('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, description: 'User profile updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
        const userId = req.user._id;
        return this.usersService.update(userId, updateUserDto);
    }
}
