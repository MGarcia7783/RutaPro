import { Module } from '@nestjs/common';
import { EtapaService } from './etapa.service';
import { EtapaController } from './etapa.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EtapaService],
  controllers: [EtapaController],
})
export class EtapaModule {}
