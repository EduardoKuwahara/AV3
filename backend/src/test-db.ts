import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco...');
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida com sucesso!');
    
    const aeronaves = await prisma.aeronave.findMany();
    console.log('📊 Aeronaves encontradas:', aeronaves.length);
    
  } catch (error) {
    console.error('❌ Erro ao conectar com banco:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão fechada');
  }
}

testConnection();