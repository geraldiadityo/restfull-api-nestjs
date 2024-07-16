import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { error } from "console";
const prisma = new PrismaClient();

async function main(){
    await prisma.user.create({
        data: {
            username: 'geraldi',
            password: bcrypt.hashSync("Ge@140019", 10),
            role: 'Superadmin',
            name: 'geraldi adityo'
        }
    });
}
main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect
    });
