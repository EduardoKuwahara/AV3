import { Aeronave } from "./Aeronave";
import * as fs from 'fs';
import * as path from 'path';

export class Relatorio {
    
    gerar(aeronave: Aeronave, cliente: string, dataEntrega: string): string {
        let conteudo = `
========================================
RELATÓRIO FINAL DE ENTREGA DE AERONAVE
========================================
Data de Geração: ${new Date().toLocaleDateString('pt-BR')}

--- DADOS DO CLIENTE ---
Cliente: ${cliente}
Data de Entrega Prevista: ${dataEntrega}

--- DADOS DA AERONAVE ---
Código: ${aeronave.codigo}
Modelo: ${aeronave.modelo}
Tipo: ${aeronave.tipo}
Capacidade: ${aeronave.capacidade} passageiros
Alcance: ${aeronave.alcance} km

--- PEÇAS UTILIZADAS ---
${aeronave.pecas.map(p => `- ${p.nome} (Fornecedor: ${p.fornecedor}, Tipo: ${p.tipo})`).join('\n')}

--- ETAPAS DE PRODUÇÃO REALIZADAS ---
${aeronave.etapas.length === 0 ? 'Nenhuma etapa realizada.' : aeronave.etapas.map(e => {
        const funcs = e.funcionarios && e.funcionarios.length > 0
            ? e.funcionarios.map(f => `      - ${f.id}: ${f.nome} (${f.nivelPermissao})`).join('\n')
            : '      (Nenhum funcionário associado)';
        return `- ${e.nome}\n      Prazo: ${e.prazo}\n      Status: ${e.status}\n      Funcionários:\n${funcs}`;
    }).join('\n')}

--- RESULTADOS DOS TESTES ---
${aeronave.testes.map(t => `- Teste ${t.tipo}: ${t.resultado}`).join('\n')}

========================================
        `;
        return conteudo.trim();
    }

    salvar(aeronave: Aeronave, cliente: string, dataEntrega: string): void {
        const conteudoRelatorio = this.gerar(aeronave, cliente, dataEntrega);
        const dir = path.join('relatorios');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const nomeArquivo = path.join(dir, `relatorio_${aeronave.codigo}.txt`);
        try {
            fs.writeFileSync(nomeArquivo, conteudoRelatorio, 'utf-8');
            console.log(`Relatório salvo em '${nomeArquivo}'.`);
        } catch (err) {
            console.error('Erro ao salvar relatório:', err);
        }
    }
}