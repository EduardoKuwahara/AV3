import * as fs from 'fs';
import * as path from 'path';

export class Persistencia {
  static salvarJSON<T>(caminho: string, dados: T[]): void {
    const dir = path.dirname(caminho);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf-8');
  }

  static carregarJSON<T>(caminho: string): T[] {
    if (!fs.existsSync(caminho)) return [];
    const conteudo = fs.readFileSync(caminho, 'utf-8');
    return JSON.parse(conteudo);
  }
}
