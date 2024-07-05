import { Injectable } from "@nestjs/common";
import { PrismaServices } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt';
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
}