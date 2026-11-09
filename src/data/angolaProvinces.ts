import { AngolanProvince } from '../types';

export interface ProvinceInfo {
  name: AngolanProvince;
  capital: string;
  municipalities: string[];
  economicHub: string;
  isCoastal: boolean;
}

export const ANGOLAN_PROVINCES: ProvinceInfo[] = [
  {
    name: 'Luanda',
    capital: 'Luanda',
    municipalities: ['Luanda', 'Talatona', 'Belas', 'Cazenga', 'Viana', 'Cacuaco', 'Kilamba Kiaxi'],
    economicHub: 'Centro Financeiro, Petróleo, Comércio, Tecnologia & Portuário',
    isCoastal: true,
  },
  {
    name: 'Benguela',
    capital: 'Benguela',
    municipalities: ['Benguela', 'Lobito', 'Catumbela', 'Baía Farta', 'Cubal', 'Ganda', 'Balombo', 'Bocoio', 'Caimbambo', 'Chongorói'],
    economicHub: 'Corredor do Lobito, Indústria, Pescas, Comércio & Logística Portuária',
    isCoastal: true,
  },
  {
    name: 'Huambo',
    capital: 'Huambo',
    municipalities: ['Huambo', 'Caála', 'Bailundo', 'Longonjo', 'Ecunha', 'Ucuma', 'Chinjenje', 'Catchiungo', 'Chicala-Choloanga', 'Londuimbali', 'Mungo'],
    economicHub: 'Agro-indústria, Ensino Universitário, Comércio & Distribuição',
    isCoastal: false,
  },
  {
    name: 'Huíla',
    capital: 'Lubango',
    municipalities: ['Lubango', 'Humpata', 'Chibia', 'Matala', 'Quilengues', 'Quipungo', 'Caconda', 'Caluquembe', 'Chicomba', 'Chipindo', 'Cuvango', 'Jamba'],
    economicHub: 'Agropecuária, Indústria Alimentar, Turismo, Mineração & Ensino',
    isCoastal: false,
  },
  {
    name: 'Cabinda',
    capital: 'Cabinda',
    municipalities: ['Cabinda', 'Cacongo', 'Buco-Zau', 'Belize'],
    economicHub: 'Exploração Petrolífera Offshore, Silvicultura & Logística Fronteiriça',
    isCoastal: true,
  },
  {
    name: 'Cuanza Sul',
    capital: 'Sumbe',
    municipalities: ['Sumbe', 'Porto Amboim', 'Waku Kungo (Cela)', 'Amboim (Gabela)', 'Libolo', 'Quibala', 'Seles', 'Conda', 'Ebo', 'Mussende', 'Quilenda', 'Cassongue'],
    economicHub: 'Agricultura Intensiva, Pescas, Indústria de Cimento & Petróleo',
    isCoastal: true,
  },
  {
    name: 'Cuanza Norte',
    capital: 'Ndalatando',
    municipalities: ['Cazengo (Ndalatando)', 'Cambambe (Dondo)', 'Ambaca', 'Golungo Alto', 'Lucala', 'Samba Caju', 'Banga', 'Bolongongo', 'Gonguembo', 'Quiculungo'],
    economicHub: 'Energia Hidroeléctrica (Capanda/Laúca), Transformação & Comércio',
    isCoastal: false,
  },
  {
    name: 'Malanje',
    capital: 'Malanje',
    municipalities: ['Malanje', 'Cacuso', 'Calandula', 'Cangandala', 'Mucari', 'Quela', 'Cambundi-Catembo', 'Luquembo', 'Massango', 'Marimba', 'Quirima'],
    economicHub: 'Pólo Agro-industrial (Capanda), Açúcar, Algodão & Turismo',
    isCoastal: false,
  },
  {
    name: 'Uíge',
    capital: 'Uíge',
    municipalities: ['Uíge', 'Negage', 'Sanza Pombo', 'Damba', 'Bungo', 'Puri', 'Mucaba', 'Songo', 'Quitexe', 'Ambuíla', 'Bembe', 'Buengas', 'Milunga', 'Quimbele', 'Zombo'],
    economicHub: 'Café, Mandioca, Comércio Transfronteiriço & Pecuária',
    isCoastal: false,
  },
  {
    name: 'Zaire',
    capital: "M'banza Kongo",
    municipalities: ['Soyo', "M'banza Kongo", 'Nzeto', 'Tomboco', 'Cuimba', 'Noqui'],
    economicHub: 'Gás Natural (Angola LNG), Petróleo, Património Mundial & Pesca',
    isCoastal: true,
  },
  {
    name: 'Bié',
    capital: 'Cuito',
    municipalities: ['Cuito', 'Andulo', 'Camacupa', 'Catabola', 'Chinguar', 'Chitembo', 'Cuemba', 'Cunhinga', 'Nharea'],
    economicHub: 'Grãos, Soja, Milho, Construção e Corredor Ferroviário CFB',
    isCoastal: false,
  },
  {
    name: 'Moxico',
    capital: 'Luena',
    municipalities: ['Luena (Moxico)', 'Camanongue', 'Léua', 'Luacano', 'Cameia'],
    economicHub: 'Corredor do Lobito Leste, Silvicultura & Pesca Continental',
    isCoastal: false,
  },
  {
    name: 'Moxico Leste',
    capital: 'Cazombo',
    municipalities: ['Cazombo (Alto Zambeze)', 'Luau', 'Bundas'],
    economicHub: 'Porto Seco de Fronteira com a RDC/Zâmbia & Agricultura',
    isCoastal: false,
  },
  {
    name: 'Cuando',
    capital: 'Menongue',
    municipalities: ['Menongue', 'Cuchi', 'Cuito Cuanavale'],
    economicHub: 'Pecuária, Madeira, Mineração & Ecoturismo Okavango',
    isCoastal: false,
  },
  {
    name: 'Cubango',
    capital: 'Mavinga',
    municipalities: ['Mavinga', 'Dirico', 'Rivungo', 'Calai', 'Cuangar'],
    economicHub: 'Conservação Transfronteiriça KAZA & Recursos Hídricos',
    isCoastal: false,
  },
  {
    name: 'Cunene',
    capital: 'Ondjiva',
    municipalities: ['Ondjiva (Cuanhama)', 'Namacunde (Santa Clara)', 'Ombadja (Xangongo)', 'Cahama', 'Cuvelai', 'Curoca'],
    economicHub: 'Comércio Internacional com a Namíbia, Pecuária Bovina & Logística',
    isCoastal: false,
  },
  {
    name: 'Namibe',
    capital: 'Moçâmedes',
    municipalities: ['Moçâmedes', 'Tômbwa', 'Bibala', 'Camucuio', 'Virei'],
    economicHub: 'Pescas, Sal Marinho, Porto Mineraleiro de Sacomar & Mármores',
    isCoastal: true,
  },
  {
    name: 'Lunda Norte',
    capital: 'Dundo',
    municipalities: ['Dundo (Chitato)', 'Lucapa', 'Cuango', 'Cambulo', 'Capenda-Camulemba', 'Caungula', 'Cuílo', 'Lóvua', 'Lubalo', 'Xá-Muteba'],
    economicHub: 'Extracção de Diamantes, Agricultura & Comércio Fronteiriço',
    isCoastal: false,
  },
  {
    name: 'Lunda Sul',
    capital: 'Saurimo',
    municipalities: ['Saurimo', 'Cacolo', 'Dala', 'Muconda'],
    economicHub: 'Pólo de Lapidação de Diamantes de Saurimo & Mineração (Catoca)',
    isCoastal: false,
  },
  {
    name: 'Bengo',
    capital: 'Caxito',
    municipalities: ['Dande (Caxito)', 'Ambriz', 'Bula Atumba', 'Dembos (Quibaxe)', 'Nambuangongo', 'Pango Aluquém'],
    economicHub: 'Banana de Caxito, Porto de Ambriz, Pesca & Agro-indústria',
    isCoastal: true,
  },
  {
    name: 'Icolo e Bengo',
    capital: 'Catete',
    municipalities: ['Catete (Icolo e Bengo)', 'Quiçama (Muxima)'],
    economicHub: 'Pólos Industriais em Expansão, Aeroporto Dr. António Agostinho Neto & Turismo',
    isCoastal: true,
  },
];

export const ALL_PROVINCES: AngolanProvince[] = ANGOLAN_PROVINCES.map((p) => p.name);

export const JOB_CATEGORIES = [
  'Petróleo & Gás',
  'Banca, Seguros & Finanças',
  'Telecomunicações & TI',
  'Saúde & Farmacêutica',
  'Educação & Formação',
  'Logística, Cargas & Transportes',
  'Construção Civil & Engenharia',
  'Comércio, Retalho & Supermercados',
  'Recursos Humanos & Administração',
  'Hotelaria, Restauração & Turismo',
  'Indústria & Produção Fabril',
  'Agricultura & Agro-negócio',
  'Segurança & Vigilância',
  'Outros Sectores',
] as const;
