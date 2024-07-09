import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaServices } from "../common/prisma.service";
import { Logger } from "winston";
import { Contact, User } from "@prisma/client";
import { ValidationService } from "../common/validation.service";
import { ContactResponse, CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../model/contact.model";
import { ContactValidation } from "./contact.validation";
import { WebResponse } from "../model/web.model";

@Injectable()
export class ContactService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaServices: PrismaServices,
        private validationService: ValidationService
    ) {}

    toContactResponse(contact: Contact): ContactResponse {
        return {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
            id: contact.id
        }
    }

    async create(
        user: User,
        request: CreateContactRequest,
    ): Promise<ContactResponse> {
        this.logger.debug(`ContactService.create(${JSON.stringify(user)},${JSON.stringify(request)})`)
        const createRequest: CreateContactRequest = this.validationService.validate(ContactValidation.CREATE, request);
        
        const contact = await this.prismaServices.contact.create({
            data: {
                ...createRequest,
                ...{username: user.username}
            }
        });

        return this.toContactResponse(contact)
    }

    async contactMustBeExists(username: string, contactId: number): Promise<Contact> {
        const contact = await this.prismaServices.contact.findFirst({
            where: {
                username: username,
                id: contactId
            }
        });

        if (!contact){
            throw new HttpException('Contact is not found!', 404);
        }

        return contact;
    }

    async get(
        user: User,
        contactId: number
    ): Promise<ContactResponse> {
        const contact = await this.contactMustBeExists(user.username, contactId);
        
        return this.toContactResponse(contact)
    }
    
    async update(
        user: User,
        request: UpdateContactRequest
    ): Promise<ContactResponse> {
        const updateRequest = this.validationService.validate(ContactValidation.UPDATE, request);
        let contact = await this.contactMustBeExists(user.username, updateRequest.id);

        contact = await this.prismaServices.contact.update({
            where: {
                username: contact.username,
                id: contact.id
            },
            data: updateRequest
        });

        return this.toContactResponse(contact);

    }

    async remove(
        user: User,
        contactId: number
    ): Promise<ContactResponse> {
        await this.contactMustBeExists(user.username, contactId);

        const contact = await this.prismaServices.contact.delete({
            where: {
                id: contactId,
                username: user.username
            }
        });

        return this.toContactResponse(contact);
    }

    async search(
        user: User,
        request: SearchContactRequest
    ): Promise<WebResponse<ContactResponse[]>> {
        const searchRequest: SearchContactRequest = this.validationService.validate(ContactValidation.SEARCH, request);
        const filters = [];

        if (searchRequest.name){
            filters.push({
                OR: [
                    {
                        first_name: {
                            contains: searchRequest.name,
                        }
                    },
                    {
                        last_name: {
                            contains: searchRequest.name
                        }
                    }
                ]
            });
        }

        if (searchRequest.email){
            filters.push({
                email: {
                    contains: searchRequest.email
                }
            });
        }

        if (searchRequest.phone){
            filters.push({
                phone: {
                    contains: searchRequest.phone
                }
            });
        }

        const skip = (searchRequest.page - 1) * searchRequest.size;

        const total = await this.prismaServices.contact.count({
            where: {
                username: user.username,
                AND: filters
            },
        })

        const contacts = await this.prismaServices.contact.findMany({
            where: {
                username: user.username,
                AND: filters
            },
            take: searchRequest.size,
            skip: skip
        })

        return {
            data: contacts.map(contact => this.toContactResponse(contact)),
            paging: {
                current_page: searchRequest.page,
                size: searchRequest.size,
                total_page: Math.ceil(total/searchRequest.size)
            }
        }
    }
}