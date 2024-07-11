import { Inject, NestMiddleware } from '@nestjs/common';
import { PrismaServices } from './prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaServices,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}
  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = req.headers['authorization'] as string;
    // this.logger.info(token);
    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });

      if (user) {
        req.user = user;
      }
    }
    next();
  }
}
