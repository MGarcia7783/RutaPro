import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';
import { ETAPA_REPOSITORY } from '../../application/common/etapa-repository.token';
import { PrismaEtapaRepository } from '../../infrastructure/repositories/prisma-etapa.repository';
import { CrearEtapaUseCase } from '../../application/etapas/crear-etapa.use-case';
import { ListarEtapasUseCase } from '../../application/etapas/listar-etapas.use-case';
import { ObtenerEtapaUseCase } from '../../application/etapas/obtener-etapa.use-case';
import { ActualizarEtapaUseCase } from '../../application/etapas/actualizar-etapa.use-case';
import { EliminarEtapaUseCase } from '../../application/etapas/eliminar-etapa.use-case';
import { EtapasController } from './etapas.controller';
import { RutasModule } from '../rutas/rutas.module';

@Module({
  imports: [RutasModule],

  providers: [
    PrismaService,
    {
      provide: ETAPA_REPOSITORY,
      useClass: PrismaEtapaRepository,
    },

    CrearEtapaUseCase,
    ListarEtapasUseCase,
    ObtenerEtapaUseCase,
    ActualizarEtapaUseCase,
    EliminarEtapaUseCase,
  ],
  controllers: [EtapasController],
})
export class EtapasModule {}
