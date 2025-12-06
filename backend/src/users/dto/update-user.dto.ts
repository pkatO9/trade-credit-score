import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ required: false, example: 'John Doe', description: 'User name' })
    name?: string;

    @ApiProperty({ required: false, example: 'Acme Corp', description: 'Business name' })
    businessName?: string;

    @ApiProperty({ required: false, example: 'en', description: 'Preferred language' })
    language?: string;
}
