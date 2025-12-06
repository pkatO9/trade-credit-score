import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
    @ApiProperty({ example: 500.00, description: 'Payment amount' })
    @IsNumber()
    amount: number;

    @ApiProperty({ example: 'cash', description: 'Payment mode (cash, bank, cheque, etc.)' })
    @IsString()
    mode: string;

    @ApiProperty({ example: '2024-12-06', description: 'Payment date (ISO string)' })
    @IsDateString()
    date: string;

    @ApiProperty({ required: false, example: 'TXN123456', description: 'Transaction reference' })
    @IsOptional()
    @IsString()
    txRef?: string;
}
