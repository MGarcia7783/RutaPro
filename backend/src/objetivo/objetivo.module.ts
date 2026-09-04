import { Module } from '@nestjs/common';
import { ObjetivoService } from './objetivo.service';
import { ObjetivoController } from './objetivo.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ObjetivoService],
  controllers: [ObjetivoController],
})
export class ObjetivoModule {}
