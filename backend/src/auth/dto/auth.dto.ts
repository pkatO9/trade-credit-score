import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
    @ApiProperty({ example: '+1234567890', description: 'Phone number to request OTP for' })
    phone: string;
}

export class VerifyOtpDto {
    @ApiProperty({ example: '+1234567890', description: 'Phone number' })
    phone: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Request ID from request-otp' })
    requestId: string;

    @ApiProperty({ example: '123456', description: 'One Time Password' })
    otp: string;
}
