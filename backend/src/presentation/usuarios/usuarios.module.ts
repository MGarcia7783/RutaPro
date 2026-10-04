import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';
import { USUARIO_REPOSITORY } from '../../application/common/usuario-repository.token';
import { PrismaUsuarioRepository } from '../../infrastructure/repositories/prisma-usuario.repository';
import { CrearUsuarioUseCase } from '../../application/usuarios/crear-usuario.use-case';
import { ObtenerUsuarioUseCase } from '../../application/usuarios/obtener-usuario.use-case';
import { ActualizarUsuarioUseCase } from '../../application/usuarios/actualizar-usuario.use-case';
import { EliminarUsuarioUseCase } from '../../application/usuarios/eliminar-usuario.use-case';
import { ListarUsuarioUseCase } from '../../application/usuarios/listar-usuario.use-case';

@Module({
  controllers: [UsuariosController],
  providers: [
    PrismaService,
    {
      provide: USUARIO_REPOSITORY,
      useClass: PrismaUsuarioRepository,
    },
    CrearUsuarioUseCase,
    ObtenerUsuarioUseCase,
    ListarUsuarioUseCase,
    ActualizarUsuarioUseCase,
    EliminarUsuarioUseCase,
  ],
  exports: [USUARIO_REPOSITORY],
})
export class UsuariosModule {}
