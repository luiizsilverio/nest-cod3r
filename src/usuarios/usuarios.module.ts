import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [UsuariosController]
})
export class UsuariosModule {}
