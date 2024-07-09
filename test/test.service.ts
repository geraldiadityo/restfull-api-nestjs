import { Injectable } from "@nestjs/common";
import { PrismaServices } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt';
import { Contact } from "@prisma/client";
@Injectable()
export class TestService {
    constructor(private prismaServices: PrismaServices){}

    async deleteUser() {
        await this.prismaServices.user.deleteMany({
            where: {
                username: 'test'
            }
        });
    }

    async deleteContact() {
        await this.prismaServices.contact.deleteMany({
            where: {
                username: 'test'
            }
        });
    }

    

    async createUser() {
        await this.prismaServices.user.create({
            data: {
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('test', 10),
                token: 'test'
            }
        });
    }

    async getContact(): Promise<Contact> {
        return this.prismaServices.contact.findFirst({
            where: {
                username: 'test'
            }
        });
    }

    async createContact() {
        await this.prismaServices.contact.create({
            data: {
                first_name: 'test',
                last_name: 'test',
                email: 'test@example.com',
                phone: '0812345678',
                username: 'test'
            }
        });
    }
}