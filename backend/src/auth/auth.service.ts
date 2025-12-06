import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    private otps = new Map<string, { phone: string; otp: string }>();

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async requestOtp(phone: string): Promise<string> {
        const requestId = uuidv4();
        const otp = '123456'; // Stub OTP
        this.otps.set(requestId, { phone, otp });
        console.log(`OTP for ${phone} (requestId: ${requestId}): ${otp}`);
        return requestId;
    }

    async verifyOtp(phone: string, requestId: string, otp: string) {
        const storedOtp = this.otps.get(requestId);
        if (!storedOtp || storedOtp.phone !== phone || storedOtp.otp !== otp) {
            return null;
        }

        this.otps.delete(requestId);

        let user = await this.usersService.findByPhone(phone);
        if (!user) {
            user = await this.usersService.create(phone);
        }

        const payload = { sub: (user as any)._id, phone: user.phone, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
}
