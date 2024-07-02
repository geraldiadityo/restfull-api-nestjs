import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaServices } from './prisma.service';
import { ValidationService } from './validation.service';

@Global()
@Module({
    imports: [WinstonModule.forRoot({
        format: winston.format.json(),
        transports: [
            new winston.transports.Console()
        ]
    }),
    ConfigModule.forRoot({
        isGlobal: true
    })
    ],
    providers: [PrismaServices, ValidationService],
    exports: [PrismaServices, ValidationService]
})
export class CommonModule {}
