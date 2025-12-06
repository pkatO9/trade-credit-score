import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact.dto';

// NestJS mapped-types might need to be installed or use manual partial
export class UpdateContactDto {
    name?: string;
    phone?: string;
    email?: string;
}
