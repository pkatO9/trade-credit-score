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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    create(@Request() req: any, @Body() createContactDto: CreateContactDto) {
        return this.contactsService.create(createContactDto, req.user._id);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.contactsService.findAll(req.user._id);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.contactsService.findOne(id, req.user._id);
    }

    @Put(':id')
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateContactDto: UpdateContactDto,
    ) {
        return this.contactsService.update(id, req.user._id, updateContactDto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.contactsService.remove(id, req.user._id);
    }
}
