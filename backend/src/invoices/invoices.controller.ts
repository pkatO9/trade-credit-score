import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Request,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from '../payments/dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) { }

    @Post()
    create(@Request() req: any, @Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoicesService.create(createInvoiceDto, req.user._id);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.invoicesService.findAll(req.user._id);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.invoicesService.findOne(id, req.user._id);
    }

    @Post(':id/payments')
    addPayment(
        @Request() req: any,
        @Param('id') id: string,
        @Body() createPaymentDto: CreatePaymentDto,
    ) {
        return this.invoicesService.addPayment(id, req.user._id, createPaymentDto);
    }
}
