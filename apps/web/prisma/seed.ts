import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIAS = [
  {
    nome: "Móveis e Utensílios",
    vidaUtilAnos: 10,
    taxaAnual: 10,
    tipos: [
      "Mesa", "Cadeira", "Poltrona", "Banco", "Armário", "Estante",
      "Prateleira", "Arquivo", "Gaveteiro", "Balcão", "Mesa de Reunião",
      "Sofá", "Rack", "Quadro Branco", "Bebedouro", "Ventilador",
      "Ar-condicionado",
    ],
  },
  {
    nome: "Equipamentos de Informática",
    vidaUtilAnos: 5,
    taxaAnual: 20,
    tipos: [
      "Computador (Desktop)", "Notebook", "Monitor", "Impressora", "Scanner",
      "Roteador", "Switch", "Nobreak", "HD Externo", "Pen Drive", "Teclado",
      "Mouse", "Projetor", "Tablet",
    ],
  },
  {
    nome: "Equipamentos de Comunicação",
    vidaUtilAnos: 5,
    taxaAnual: 20,
    tipos: [
      "Telefone Fixo", "Celular Corporativo", "Central Telefônica",
      "Rádio Comunicador",
    ],
  },
  {
    nome: "Máquinas e Equipamentos",
    vidaUtilAnos: 10,
    taxaAnual: 10,
    tipos: [
      "Máquina de Lavar", "Geladeira", "Fogão", "Micro-ondas",
      "Cortador de Grama", "Roçadeira", "Bomba d'Água", "Gerador",
      "Compressor",
    ],
  },
  {
    nome: "Veículos",
    vidaUtilAnos: 5,
    taxaAnual: 20,
    tipos: ["Carro", "Van", "Caminhão", "Motocicleta", "Bicicleta"],
  },
  {
    nome: "Ferramentas",
    vidaUtilAnos: 5,
    taxaAnual: 20,
    tipos: [
      "Furadeira", "Serra", "Chave de Fenda", "Alicate", "Martelo",
      "Escada", "Caixa de Ferramentas",
    ],
  },
  {
    nome: "Bens Imóveis",
    vidaUtilAnos: 25,
    taxaAnual: 4,
    tipos: ["Terreno", "Prédio", "Sala Comercial", "Galpão"],
  },
  {
    nome: "Acervo Bibliográfico",
    vidaUtilAnos: 5,
    taxaAnual: 20,
    tipos: ["Livro", "Revista", "Periódico", "DVD/CD Educativo"],
  },
  {
    nome: "Equipamentos de Áudio/Vídeo",
    vidaUtilAnos: 5,
    taxaAnual: 20,
    tipos: [
      "Caixa de Som", "Microfone", "Mesa de Som", "Câmera Fotográfica",
      "Filmadora", "Televisão", "Aparelho de DVD",
    ],
  },
  {
    nome: "Material Esportivo",
    vidaUtilAnos: 5,
    taxaAnual: 20,
    tipos: [
      "Bola", "Rede", "Colchonete", "Tatame", "Bicicleta Ergométrica",
      "Esteira", "Equipamento de Musculação",
    ],
  },
  {
    nome: "Material Pedagógico",
    vidaUtilAnos: 5,
    taxaAnual: 20,
    tipos: [
      "Quadro Interativo", "Globo", "Mapa", "Kit de Ciências",
      "Instrumento Musical", "Brinquedo Educativo",
    ],
  },
  {
    nome: "Outros",
    vidaUtilAnos: 5,
    taxaAnual: 20,
    tipos: ["Outro"],
  },
];

async function main() {
  console.log("Seeding database...\n");

  // 1. Organização
  const org = await prisma.organizacao.upsert({
    where: { id: "org-dalton" },
    update: {},
    create: {
      id: "org-dalton",
      nome: "Instituto Dalton Salomão",
      enderecoSede: "Presidente Epitácio — SP",
      prefixoTombamento: "IDS",
      proximoTombamento: 1,
    },
  });
  console.log(`✓ Organização: ${org.nome}`);

  // 2. Unidade sede
  const sede = await prisma.unidade.upsert({
    where: { codigo: "UND-001" },
    update: {},
    create: {
      codigo: "UND-001",
      nome: "Sede Presidente Epitácio",
      responsavel: "Administrador",
      cidade: "Presidente Epitácio",
      uf: "SP",
      situacao: "ATIVA",
      organizacaoId: org.id,
    },
  });
  console.log(`✓ Unidade: ${sede.nome}`);

  // 3. Setores da sede
  const setoresNomes = [
    "Secretaria", "Administração", "Sala de Aula", "Almoxarifado",
    "Cozinha", "Biblioteca", "Quadra Esportiva",
  ];
  for (const nome of setoresNomes) {
    await prisma.setor.upsert({
      where: { unidadeId_nome: { unidadeId: sede.id, nome } },
      update: {},
      create: { nome, unidadeId: sede.id },
    });
  }
  console.log(`✓ ${setoresNomes.length} setores criados`);

  // 4. Categorias e tipos
  for (const cat of CATEGORIAS) {
    const categoria = await prisma.categoria.upsert({
      where: { nome: cat.nome },
      update: {},
      create: {
        nome: cat.nome,
        vidaUtilAnos: cat.vidaUtilAnos,
        taxaAnual: cat.taxaAnual,
      },
    });
    for (const tipo of cat.tipos) {
      await prisma.tipoItem.upsert({
        where: { categoriaId_nome: { categoriaId: categoria.id, nome: tipo } },
        update: {},
        create: { nome: tipo, categoriaId: categoria.id },
      });
    }
  }
  console.log(`✓ ${CATEGORIAS.length} categorias com tipos criados`);

  // 5. Usuário admin
  const senhaHash = await hash("admin123", 12);
  const admin = await prisma.usuario.upsert({
    where: { email: "admin@institutodalton.org.br" },
    update: {},
    create: {
      nome: "Administrador Geral",
      email: "admin@institutodalton.org.br",
      senhaHash,
      situacao: "ATIVO",
      primeiroAcesso: true,
    },
  });
  console.log(`✓ Usuário admin: ${admin.email}`);

  // 6. Vincular admin a todas as unidades como ADMIN_GERAL
  await prisma.usuarioUnidade.upsert({
    where: {
      usuarioId_unidadeId: { usuarioId: admin.id, unidadeId: sede.id },
    },
    update: {},
    create: {
      usuarioId: admin.id,
      unidadeId: sede.id,
      perfil: "ADMIN_GERAL",
    },
  });
  console.log(`✓ Admin vinculado à sede`);

  console.log("\n✅ Seed concluído!");
  console.log("\nCredenciais de acesso:");
  console.log("  E-mail: admin@institutodalton.org.br");
  console.log("  Senha:  admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
