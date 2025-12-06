import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('request-otp')
    async requestOtp(@Body('phone') phone: string) {
        const requestId = await this.authService.requestOtp(phone);
        return { requestId };
    }

    @Post('verify-otp')
    async verifyOtp(
        @Body('phone') phone: string,
        @Body('requestId') requestId: string,
        @Body('otp') otp: string,
    ) {
        const result = await this.authService.verifyOtp(phone, requestId, otp);
        if (!result) {
            throw new UnauthorizedException('Invalid OTP');
        }
        return result;
    }
}
