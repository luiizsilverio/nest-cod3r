import { Module } from '@nestjs/common';
import { ProdutosModule } from './produtos/produtos.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UsuariosController } from './usuarios/usuarios.controller';

@Module({
  imports: [ProdutosModule, ConfigModule.forRoot(), DbModule, UsuariosModule],
  controllers: [UsuariosController],
  providers: [],
})

export class AppModule {}
