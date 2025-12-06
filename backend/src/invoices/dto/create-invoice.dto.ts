import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class InvoiceItemDto {
    @IsString()
    description: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    rate: number;
}

export class CreateInvoiceDto {
    @IsMongoId()
    buyerId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceItemDto)
    items: InvoiceItemDto[];

    @IsOptional()
    @IsNumber()
    dueDays?: number;

    @IsOptional()
    @IsDateString()
    dueDate?: string;
}
