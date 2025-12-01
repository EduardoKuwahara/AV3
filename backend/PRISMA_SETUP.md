# Configuração do Prisma com MySQL

## Pré-requisitos

1. **MySQL instalado** (versão 5.7 ou superior)
2. **Node.js** e **npm** instalados

## Configuração do Banco de Dados

### 1. Criar banco de dados MySQL

```sql
CREATE DATABASE aeronaves_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar variáveis de ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
# Substitua pelos seus dados de conexão MySQL
DATABASE_URL="mysql://usuario:senha@localhost:3306/aeronaves_db"

# Exemplo:
# DATABASE_URL="mysql://root:minhasenha@localhost:3306/aeronaves_db"
```

### 3. Executar migrações

```bash
# Gerar e executar a primeira migração
npx prisma migrate dev --name init

# Ou se preferir aplicar o schema sem migração (desenvolvimento)
npx prisma db push
```

### 4. Gerar cliente Prisma

```bash
npx prisma generate
```

### 5. (Opcional) Popular banco com dados de exemplo

```bash
# Executar o seed
npx tsx src/prisma/seed.ts

# Ou adicionar script no package.json:
# "seed": "tsx src/prisma/seed.ts"
# E executar: npm run seed
```

## Scripts úteis

### Visualizar banco de dados
```bash
npx prisma studio
```

### Reset completo do banco
```bash
npx prisma migrate reset
```

### Aplicar mudanças no schema sem migração
```bash
npx prisma db push
```

## Estrutura do projeto com Prisma

```
AV1/
├── prisma/
│   ├── schema.prisma          # Schema do banco
│   └── migrations/            # Migrações
├── src/
│   ├── lib/
│   │   └── prisma.ts          # Cliente Prisma configurado
│   ├── repositories/          # Repositórios (Data Access Layer)
│   │   ├── AeronaveRepository.ts
│   │   ├── FuncionarioRepository.ts
│   │   └── PecaRepository.ts
│   ├── prisma/
│   │   └── seed.ts            # Script para popular banco
│   └── exemplos/
│       └── ExemplosUso.ts     # Exemplos de uso
├── .env                       # Variáveis de ambiente
└── prisma.config.ts           # Configuração do Prisma
```

## Exemplo de uso básico

```typescript
import { prisma } from './src/lib/prisma';
import { AeronaveRepository } from './src/repositories/AeronaveRepository';

// Usando repositório
const aeronaveRepo = new AeronaveRepository();
const aeronaves = await aeronaveRepo.findAll();

// Usando cliente Prisma diretamente
const funcionarios = await prisma.funcionario.findMany();
```

## Comandos importantes

| Comando | Descrição |
|---------|-----------|
| `npx prisma init` | Inicializar Prisma |
| `npx prisma generate` | Gerar cliente |
| `npx prisma migrate dev` | Criar e aplicar migração |
| `npx prisma db push` | Aplicar schema sem migração |
| `npx prisma studio` | Interface gráfica |
| `npx prisma db seed` | Popular banco (requer configuração) |
| `npx prisma migrate reset` | Reset completo |

## Configuração de seed no package.json

Adicione no `package.json`:

```json
{
  "prisma": {
    "seed": "tsx src/prisma/seed.ts"
  },
  "scripts": {
    "db:seed": "tsx src/prisma/seed.ts"
  }
}
```

Depois execute:
```bash
npx prisma db seed
# ou
npm run db:seed
```