import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('request-otp')
    @ApiOperation({ summary: 'Request OTP for phone number' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully', schema: { example: { requestId: '123e4567-e89b-12d3-a456-426614174000' } } })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async requestOtp(@Body() dto: RequestOtpDto) {
        const requestId = await this.authService.requestOtp(dto.phone);
        return { requestId };
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP and get access token' })
    @ApiResponse({ status: 200, description: 'OTP verified successfully', schema: { example: { access_token: 'jwt-token', user: {} } } })
    @ApiResponse({ status: 401, description: 'Invalid OTP' })
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        const result = await this.authService.verifyOtp(dto.phone, dto.requestId, dto.otp);
        if (!result) {
            throw new UnauthorizedException('Invalid OTP');
        }
        return result;
    }
}
