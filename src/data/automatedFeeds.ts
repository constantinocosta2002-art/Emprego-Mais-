import { AutomatedSourceFeed, JobVacancy } from '../types';

export const INITIAL_AUTOMATED_FEEDS: AutomatedSourceFeed[] = [
  {
    id: 'feed-sonangol',
    name: 'Sonangol E.P. — Recrutamento Oficial',
    portalType: 'EMPRESA_OFICIAL',
    url: 'https://recrutamento.sonangol.co.ao',
    status: 'SINCRONIZADO',
    lastSyncAt: '2026-11-08 22:30',
    jobsCount: 14,
    description: 'Feed oficial da petrolífera estatal Sonangol (Blocos marítimos, refinaria do Lobito, Luanda e Soyo).',
    checkFrequency: 'A cada 6 horas'
  },
  {
    id: 'feed-bai',
    name: 'Banco BAI — Portal de Carreiras',
    portalType: 'EMPRESA_OFICIAL',
    url: 'https://bancobai.ao/carreiras',
    status: 'SINCRONIZADO',
    lastSyncAt: '2026-11-09 04:15',
    jobsCount: 8,
    description: 'Vagas para rede nacional de agências, auditoria, conformidade bancária e tecnologia da informação.',
    checkFrequency: 'A cada 12 horas'
  },
  {
    id: 'feed-unitel',
    name: 'Unitel Angola — Portal de Emprego',
    portalType: 'EMPRESA_OFICIAL',
    url: 'https://www.unitel.ao/carreiras',
    status: 'SINCRONIZADO',
    lastSyncAt: '2026-11-09 01:20',
    jobsCount: 11,
    description: 'Engenharia de telecomunicações, vendas corporativas, centros de dados e suporte ao cliente.',
    checkFrequency: 'A cada 8 horas'
  },
  {
    id: 'feed-carrinho',
    name: 'Grupo Carrinho — Recrutamento Industrial',
    portalType: 'EMPRESA_OFICIAL',
    url: 'https://carrinho.co.ao/recrutamento',
    status: 'SINCRONIZADO',
    lastSyncAt: '2026-11-08 19:40',
    jobsCount: 19,
    description: 'Polo Industrial do Lobito, frotas de distribuição, logística e produção alimentar.',
    checkFrequency: 'A cada 12 horas'
  },
  {
    id: 'feed-azule',
    name: 'Azule Energy — Careers Angola',
    portalType: 'EMPRESA_OFICIAL',
    url: 'https://azule-energy.com/careers',
    status: 'SINCRONIZADO',
    lastSyncAt: '2026-11-08 18:00',
    jobsCount: 6,
    description: 'Joint-venture Eni e BP em Angola para projectos de transição energética e petróleo offshore.',
    checkFrequency: 'A cada 24 horas'
  },
  {
    id: 'feed-maptss',
    name: 'MAPTSS / INEFOP — Sistema Nacional de Emprego',
    portalType: 'PORTAL_PUBLICO',
    url: 'https://maptss.gov.ao',
    status: 'SINCRONIZADO',
    lastSyncAt: '2026-11-08 16:30',
    jobsCount: 42,
    description: 'Ofertas públicas e estágios profissionais intermediados pelo Instituto Nacional de Emprego e Formação Profissional.',
    checkFrequency: 'Diário'
  },
  {
    id: 'feed-jobartis',
    name: 'Jobartis Angola — Feed de Recrutamento Autorizado',
    portalType: 'PLATAFORMA_RECRUTAMENTO',
    url: 'https://jobartis.com',
    status: 'SINCRONIZADO',
    lastSyncAt: '2026-11-09 06:00',
    jobsCount: 87,
    description: 'Agregação filtrada de oportunidades do sector privado angolano com validação de fontes.',
    checkFrequency: 'A cada 4 horas'
  },
  {
    id: 'feed-emprego-angola',
    name: 'Emprego Angola — Portal de Oportunidades',
    portalType: 'PLATAFORMA_RECRUTAMENTO',
    url: 'https://empregoangola.com',
    status: 'SINCRONIZADO',
    lastSyncAt: '2026-11-08 21:10',
    jobsCount: 35,
    description: 'Feed de ofertas profissionais verificadas nas 21 províncias de Angola.',
    checkFrequency: 'A cada 6 horas'
  }
];

// Pipeline updates simulating extra verified jobs captured during sync from authorized feeds
export const FRESH_COLLECTED_OPPORTUNITIES: JobVacancy[] = [
  {
    id: 'vaga-sync-013',
    title: 'Engenheiro de Automação & Instrumentação',
    company: 'TotalEnergies EP Angola',
    description: 'Manutenção de sistemas de controlo distribuído (DCS) e instrumentação de segurança em instalações FPSO no offshore de Angola.',
    requirements: [
      'Licenciatura em Engenharia Electrotécnica ou Automação',
      'Experiência mínima de 3 anos em instrumentação de turbinas e válvulas de controlo',
      'Inglês fluente'
    ],
    experienceLevel: '3 a 6 anos',
    documentsRequired: ['BI', 'Curriculum Vitae', 'Certificados de Habilitações', 'BOSIET'],
    province: 'Luanda',
    municipality: 'Luanda',
    deadline: '2026-12-25',
    publishedAt: '2026-11-08',
    sourceName: 'TotalEnergies Careers Angola',
    officialApplyUrl: 'https://totalenergies.avature.net/careers',
    category: 'Petróleo & Gás',
    contractType: 'Tempo Inteiro',
    isExpired: false,
    isFeatured: true,
    sector: 'Privado',
    salaryInfo: 'Remuneração Internacional + Benefícios Offshore',
    isAutoCollected: true,
    collectedFromFeedId: 'feed-sonangol'
  },
  {
    id: 'vaga-sync-014',
    title: 'Farmacêutico Responsável Técnico',
    company: 'Mecofarma Angola',
    description: 'Direcção técnica de farmácia comunitária, controlo de medicamentos sujeitos a receita médica, armazenamento climatizado e atendimento clínico na cidade do Uíge.',
    requirements: [
      'Licenciatura em Ciências Farmacêuticas',
      'Inscrição na Ordem dos Farmacêuticos de Angola (OFA)',
      'Residência ou disponibilidade para se fixar no Uíge'
    ],
    experienceLevel: 'Mínimo 1 ano',
    documentsRequired: ['BI', 'Carteira Profissional OFA', 'Certificado Universitário', 'Registo Criminal'],
    province: 'Uíge',
    municipality: 'Uíge',
    deadline: '2026-12-14',
    publishedAt: '2026-11-08',
    sourceName: 'Portal Emprego Angola',
    officialApplyUrl: 'https://empregoangola.com',
    category: 'Saúde & Farmacêutica',
    contractType: 'Tempo Inteiro',
    isExpired: false,
    isFeatured: false,
    sector: 'Privado',
    salaryInfo: 'Pacote Farmacêutico + Subsídio de Instalação na Província',
    isAutoCollected: true,
    collectedFromFeedId: 'feed-emprego-angola'
  },
  {
    id: 'vaga-sync-015',
    title: 'Operador de Máquinas Pesadas de Terraplanagem',
    company: 'Construtora Caminhos do Sul',
    description: 'Operação de motoniveladoras e pás-carregadoras na requalificação de troços rodoviários e acessos agrícolas em Malanje (Cacuso).',
    requirements: [
      'Ensino Médio concluído',
      'Carta de Condução Profissional categoria D/Pesados com experiência de pá e motoniveladora',
      'Experiência mínima de 2 anos em obras de estrada'
    ],
    experienceLevel: '2 anos em movimentação de terras',
    documentsRequired: ['BI', 'Carta de Condução Pesados', 'CV', 'Atestado Médico'],
    province: 'Malanje',
    municipality: 'Cacuso',
    deadline: '2026-12-19',
    publishedAt: '2026-11-07',
    sourceName: 'MAPTSS / INEFOP Emprego',
    officialApplyUrl: 'https://maptss.gov.ao',
    category: 'Construção Civil & Engenharia',
    contractType: 'Tempo Inteiro',
    isExpired: false,
    isFeatured: false,
    sector: 'Privado',
    salaryInfo: 'Salário Base + Subsídio de Obra + Alimentação e Pernoita',
    isAutoCollected: true,
    collectedFromFeedId: 'feed-maptss'
  }
];
