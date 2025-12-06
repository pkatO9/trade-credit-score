import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
    @ApiProperty({ example: 'John Doe', description: 'Contact name' })
    name: string;

    @ApiProperty({ example: '+1234567890', description: 'Contact phone number' })
    phone: string;

    @ApiProperty({ required: false, example: 'john@example.com', description: 'Contact email' })
    email?: string;
}
