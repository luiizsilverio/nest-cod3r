import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheProvider implements OnModuleDestroy {
  private readonly db: Redis;

  constructor() {
    console.log(process.env.REDIS_PORT);
    this.db = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    })
  }

  onModuleDestroy() {
    this.db.disconnect();
  }

  async obter(tipo: string, id: number): Promise<any> {
    const valor = await this.db.get(`${tipo}:${id}`);
    return JSON.parse(valor);
  }

  async obterTodos(tipo: string): Promise<any[]> {
    const ids = await this.db.get(tipo);
    const idsArray = ids ? JSON.parse(ids) : [];

    const valores = await Promise.all(
      idsArray.map(async (id: number) => {
        const valor = await this.obter(tipo, id);
        return valor;
      })
    )

    return valores;
  }

  async salvar(tipo: string, id: number, valor: any): Promise<void> {
    await this.db.set(`${tipo}:${id}`, JSON.stringify(valor));
    await this.atualizarIds(tipo, id);
  }

  private async atualizarIds(tipo: string, id: number): Promise<void> {
    const ids = await this.db.get(tipo);
    const idsArray = ids ? JSON.parse(ids) : [];
    if (idsArray.includes(id)) return;

    idsArray.push(+id);
    idsArray.sort();
    await this.db.set(tipo, JSON.stringify(idsArray));
  }
}

// "produtos:1" : {"id": 1, "nome": "Teclado", "preco": 30}
// "produtos:2" : {"id": 2, "nome": "Mouse", "preco": 20}
// "produtos"   : [2, 3, 4]
// "clientes:123" : {"id": 123, "nome": "Luiz"}
