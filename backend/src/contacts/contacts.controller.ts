import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Contacts')
@ApiBearerAuth()
@Controller('api/v1/contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new contact' })
    @ApiResponse({ status: 201, description: 'Contact created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Request() req: any, @Body() createContactDto: CreateContactDto) {
        return this.contactsService.create(createContactDto, req.user._id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all contacts for current user' })
    @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll(@Request() req: any) {
        return this.contactsService.findAll(req.user._id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific contact by ID' })
    @ApiResponse({ status: 200, description: 'Contact retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Contact not found' })
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.contactsService.findOne(id, req.user._id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a contact' })
    @ApiResponse({ status: 200, description: 'Contact updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Contact not found' })
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateContactDto: UpdateContactDto,
    ) {
        return this.contactsService.update(id, req.user._id, updateContactDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a contact' })
    @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Contact not found' })
    remove(@Request() req: any, @Param('id') id: string) {
        return this.contactsService.remove(id, req.user._id);
    }
}
