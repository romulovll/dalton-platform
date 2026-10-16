// Asset categories and item types
export const CATEGORIAS = [
  {
    id: "moveis",
    nome: "Móveis e Utensílios",
    tipos: [
      "Mesa", "Cadeira", "Poltrona", "Banco", "Armário", "Estante",
      "Prateleira", "Arquivo", "Gaveteiro", "Balcão", "Mesa de Reunião",
      "Sofá", "Rack", "Quadro Branco", "Bebedouro", "Ventilador",
      "Ar-condicionado",
    ],
    vidaUtilAnos: 10,
    taxaAnual: 10,
  },
  {
    id: "informatica",
    nome: "Equipamentos de Informática",
    tipos: [
      "Computador (Desktop)", "Notebook", "Monitor", "Impressora", "Scanner",
      "Roteador", "Switch", "Nobreak", "HD Externo", "Pen Drive", "Teclado",
      "Mouse", "Projetor", "Tablet",
    ],
    vidaUtilAnos: 5,
    taxaAnual: 20,
  },
  {
    id: "comunicacao",
    nome: "Equipamentos de Comunicação",
    tipos: [
      "Telefone Fixo", "Celular Corporativo", "Central Telefônica",
      "Rádio Comunicador",
    ],
    vidaUtilAnos: 5,
    taxaAnual: 20,
  },
  {
    id: "maquinas",
    nome: "Máquinas e Equipamentos",
    tipos: [
      "Máquina de Lavar", "Geladeira", "Fogão", "Micro-ondas",
      "Cortador de Grama", "Roçadeira", "Bomba d'Água", "Gerador",
      "Compressor",
    ],
    vidaUtilAnos: 10,
    taxaAnual: 10,
  },
  {
    id: "veiculos",
    nome: "Veículos",
    tipos: ["Carro", "Van", "Caminhão", "Motocicleta", "Bicicleta"],
    vidaUtilAnos: 5,
    taxaAnual: 20,
  },
  {
    id: "ferramentas",
    nome: "Ferramentas",
    tipos: [
      "Furadeira", "Serra", "Chave de Fenda", "Alicate", "Martelo",
      "Escada", "Caixa de Ferramentas",
    ],
    vidaUtilAnos: 5,
    taxaAnual: 20,
  },
  {
    id: "imoveis",
    nome: "Bens Imóveis",
    tipos: ["Terreno", "Prédio", "Sala Comercial", "Galpão"],
    vidaUtilAnos: 25,
    taxaAnual: 4,
  },
  {
    id: "bibliografico",
    nome: "Acervo Bibliográfico",
    tipos: ["Livro", "Revista", "Periódico", "DVD/CD Educativo"],
    vidaUtilAnos: 5,
    taxaAnual: 20,
  },
  {
    id: "audio_video",
    nome: "Equipamentos de Áudio/Vídeo",
    tipos: [
      "Caixa de Som", "Microfone", "Mesa de Som", "Câmera Fotográfica",
      "Filmadora", "Televisão", "Aparelho de DVD",
    ],
    vidaUtilAnos: 5,
    taxaAnual: 20,
  },
  {
    id: "esportivo",
    nome: "Material Esportivo",
    tipos: [
      "Bola", "Rede", "Colchonete", "Tatame", "Bicicleta Ergométrica",
      "Esteira", "Equipamento de Musculação",
    ],
    vidaUtilAnos: 5,
    taxaAnual: 20,
  },
  {
    id: "pedagogico",
    nome: "Material Pedagógico",
    tipos: [
      "Quadro Interativo", "Globo", "Mapa", "Kit de Ciências",
      "Instrumento Musical", "Brinquedo Educativo",
    ],
    vidaUtilAnos: 5,
    taxaAnual: 20,
  },
  {
    id: "outros",
    nome: "Outros",
    tipos: ["Outro"],
    vidaUtilAnos: 5,
    taxaAnual: 20,
  },
] as const;

export const ESTADOS_CONSERVACAO = [
  { value: "excelente", label: "Excelente", color: "bg-green-500" },
  { value: "bom", label: "Bom", color: "bg-verde-claro" },
  { value: "regular", label: "Regular", color: "bg-amarelo" },
  { value: "ruim", label: "Ruim", color: "bg-orange-500" },
  { value: "inservivel", label: "Inservível", color: "bg-vermelho" },
] as const;

export const SITUACOES_BEM = [
  { value: "ativo", label: "Ativo" },
  { value: "em_manutencao", label: "Em Manutenção" },
  { value: "cedido", label: "Cedido" },
  { value: "baixado", label: "Baixado" },
  { value: "desaparecido", label: "Desaparecido" },
] as const;

export const FORMAS_AQUISICAO = [
  { value: "compra", label: "Compra" },
  { value: "doacao", label: "Doação" },
  { value: "cessao", label: "Cessão" },
  { value: "comodato", label: "Comodato" },
  { value: "transferencia", label: "Transferência" },
] as const;

export const ORIGENS_RECURSO = [
  { value: "proprio", label: "Recursos Próprios" },
  { value: "parceria_publica", label: "Parceria Pública" },
  { value: "doacao", label: "Doação" },
] as const;

export const PERFIS_ACESSO = [
  { value: "admin_geral", label: "Administrador Geral" },
  { value: "admin_unidade", label: "Administrador de Unidade" },
  { value: "gestor", label: "Gestor Patrimonial" },
  { value: "responsavel_setor", label: "Responsável de Setor" },
  { value: "contador", label: "Contador" },
  { value: "auditor", label: "Auditor" },
  { value: "consulta", label: "Consulta" },
] as const;

export const SITUACOES_UNIDADE = [
  { value: "ativa", label: "Ativa" },
  { value: "inativa", label: "Inativa" },
  { value: "em_implantacao", label: "Em Implantação" },
] as const;

export const UFS_BRASIL = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;
