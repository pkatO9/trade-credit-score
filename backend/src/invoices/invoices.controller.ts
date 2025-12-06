import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from '../payments/dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Invoices')
@ApiBearerAuth()
@Controller('api/v1/invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new invoice' })
    @ApiResponse({ status: 201, description: 'Invoice created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Request() req: any, @Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoicesService.create(createInvoiceDto, req.user._id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all invoices for current user' })
    @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll(@Request() req: any) {
        return this.invoicesService.findAll(req.user._id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific invoice by ID' })
    @ApiResponse({ status: 200, description: 'Invoice retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invoice not found' })
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.invoicesService.findOne(id, req.user._id);
    }

    @Post(':id/payments')
    @ApiOperation({ summary: 'Add a payment to an invoice' })
    @ApiResponse({ status: 201, description: 'Payment added successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invoice not found' })
    addPayment(
        @Request() req: any,
        @Param('id') id: string,
        @Body() createPaymentDto: CreatePaymentDto,
    ) {
        return this.invoicesService.addPayment(id, req.user._id, createPaymentDto);
    }
}
