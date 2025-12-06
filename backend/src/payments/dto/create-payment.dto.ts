import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
    @IsNumber()
    amount: number;

    @IsString()
    mode: string;

    @IsDateString()
    date: string;

    @IsOptional()
    @IsString()
    txRef?: string;
}
