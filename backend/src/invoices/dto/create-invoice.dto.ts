import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InvoiceItemDto {
    @ApiProperty({ example: 'Product A', description: 'Item description' })
    @IsString()
    description: string;

    @ApiProperty({ example: 2, description: 'Quantity' })
    @IsNumber()
    quantity: number;

    @ApiProperty({ example: 100.50, description: 'Rate per unit' })
    @IsNumber()
    rate: number;
}

export class CreateInvoiceDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Buyer contact ID' })
    @IsMongoId()
    buyerId: string;

    @ApiProperty({ type: [InvoiceItemDto], description: 'Invoice line items' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceItemDto)
    items: InvoiceItemDto[];

    @ApiProperty({ required: false, example: 30, description: 'Number of days until due' })
    @IsOptional()
    @IsNumber()
    dueDays?: number;

    @ApiProperty({ required: false, example: '2024-12-31', description: 'Due date (ISO string)' })
    @IsOptional()
    @IsDateString()
    dueDate?: string;
}
