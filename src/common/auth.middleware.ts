import { HttpException, Inject, NestMiddleware } from '@nestjs/common';
import { PrismaServices } from './prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as jwt from 'jsonwebtoken';
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaServices,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}
  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token){
      throw new HttpException('Invalid Credential', 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY) as { username: string }
      
      const user = await this.prismaService.user.findUnique({
        where: {
          username: decoded.username
        }
      });

      req.user = user;
      next();
    } catch(err){
      throw new HttpException('Invalid Token', 401);
    }
  }
}
