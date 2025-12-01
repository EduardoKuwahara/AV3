# AeroCode - Sistema de Gestão de Aeronaves

Sistema para gerenciamento de aeronaves com backend Node.js + MySQL e frontend React.

## 🚀 Como Rodar a Aplicação

### 1. Clone o Repositório
```bash
git clone https://github.com/EduardoKuwahara/AV3.git
cd AV3
```

### 2. Configure o MySQL
Abra o MySQL Workbench, após isso digite os seguintes comando:
```sql
CREATE DATABASE aerocode;
```
```sql
USE aerocode;
```
Rode o script!

### 3. Backend
```bash
cd backend
npm install
```

Crie o arquivo `.env`:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/aerocode"
```

Execute os comandos:
```bash
npm run db:generate
npm run db:migrate
npm run build
npm run db:seed
npm run server:prisma
```

### 4. Frontend
Em outro terminal:

```bash
cd frontend

npm install
```

Crie o arquivo `.env`:
```env
REACT_APP_API_URL=http://localhost:3002/api
```
Por fim:
```
npm start
```

### 5. Acessar
- Frontend: http://localhost:3000
- Backend: http://localhost:3002

## 📋 Pré-requisitos
- Node.js 16+
- MySQL 8.0+
- Git