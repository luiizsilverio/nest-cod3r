import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import produtos from 'src/seed/produtos';
import Produto from './produtos.entity';

@Controller('produtos')
export class ProdutosController {

  @Get()
  home(): string {
    return 'Produtos';
  }

  @Get('all')
  async obterProdutos(): Promise<Produto[]> {
    return produtos;
  }

  @Get(':id')
  async obterProdutosPorId(@Param('id') id: string): Promise<Produto> {
    const produto = produtos.find(prod => prod.id === Number(id));
    return produto;
  }

  @Post()
  async criar(@Body() produto: Produto): Promise<void> {
    produtos.push({
      ...produto,
      id: produto.id || produtos.length + 1,
    });
  }

  @Patch(':id')
  async atualizar(@Param('id') id: string, @Body() produto: Partial<Produto>): Promise<void> {
    const index = produtos.findIndex(prod => prod.id === Number(id));
    if (index >= 0) {
      produtos[index] = {
        ...produtos[index],
        ...produto,
        id: Number(id)
      }
    }
  }

  @Delete(':id')
  async excluir(@Param('id') id: string): Promise<void> {
    const index = produtos.findIndex(prod => prod.id === Number(id));
    produtos.splice(index, 1);
  }
}
