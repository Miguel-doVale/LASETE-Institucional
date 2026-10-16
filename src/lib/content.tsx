import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

export type ContentType =
  'project' | 'research' | 'activity' | 'media' | 'member' | 'notice';
export type ContentItem = {
  id: string;
  type: ContentType;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  url: string;
  category: string;
  published: boolean;
  role?: string;
  area?: string;
  group?: string;
  date?: string;
  postCrop?: boolean;
};
export type Settings = {
  email: string;
  instagram: string;
  linkedin: string;
  aiUrl: string;
  selectionOpen: boolean;
  selectionNote: string;
  editalUrl: string;
  formUrl: string;
};
export type SiteData = { version: 1; items: ContentItem[]; settings: Settings };
export const navItems = [
  { to: '/', label: 'Home', number: '01' },
  { to: '/a-liga', label: 'A liga', number: '02' },
  { to: '/membros', label: 'Membros', number: '03' },
  { to: '/projetos', label: 'Projetos', number: '04' },
  { to: '/pesquisas', label: 'Pesquisas', number: '05' },
  { to: '/atividades', label: 'Atividades', number: '06' },
  { to: '/participar', label: 'Participar e contato', number: '07' },
];
const member = (
  id: string,
  title: string,
  role: string,
  area: string,
  group: string,
  image = '',
): ContentItem => ({
  id,
  type: 'member',
  title,
  subtitle: role,
  role,
  area,
  group,
  image,
  url: '',
  category: area,
  published: true,
  description: '',
});
const activity = (
  id: string,
  title: string,
  subtitle: string,
  description: string,
  image: string,
  category: string,
): ContentItem => ({
  id,
  type: 'activity',
  title,
  subtitle,
  description,
  image,
  category,
  url: 'https://www.instagram.com/lasete.undb/',
  published: true,
  postCrop: true,
});
export const initialData: SiteData = {
  version: 1,
  settings: {
    email: 'lasete.undb@gmail.com',
    instagram: 'https://www.instagram.com/lasete.undb/',
    linkedin: 'https://www.linkedin.com/company/lasete/',
    aiUrl: 'https://laseteai.streamlit.app/',
    selectionOpen: false,
    selectionNote:
      'As orientações, os requisitos e as etapas do processo seletivo estão no edital. Acompanhe os canais oficiais da liga para receber as próximas atualizações.',
    editalUrl:
      'https://drive.google.com/file/d/1gcHwt2QOeHMJhap1I15PpUr4W2yyXMWo/view',
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSc9_NLhdGbVOXJJ0AbzfpgoXmt4FolFyY_qpPRu3DmzA8fOQQ/closedform',
  },
  items: [
    {
      id: 'ctf',
      type: 'project',
      title: 'Capture the Flag',
      subtitle: 'Aprender segurança colocando o conhecimento em prática.',
      description:
        'Um ambiente de desafios desenvolvido pelos membros da LASETE. Reconhecimento, enumeração e exploração de vulnerabilidades em uma aplicação criada para a competição aproximam o estudo da prática de segurança.',
      image: '',
      url: '',
      category: 'Cibersegurança',
      published: true,
    },
    {
      id: 'lasete-ai',
      type: 'project',
      title: 'LASETE AI',
      subtitle: 'Mais uma maneira de explorar o conhecimento.',
      description:
        'Conheça a iniciativa de inteligência artificial da LASETE. A experiência está disponível em sua própria aplicação, hospedada no Streamlit.',
      image: '',
      url: 'https://laseteai.streamlit.app/',
      category: 'Inteligência artificial',
      published: true,
    },
    activity(
      'web-hacking',
      'Web Hacking no IT Works',
      'Da metodologia ao desafio.',
      'Workshop sobre reconhecimento e exploração de aplicações web, ministrado por Matheus Aguiar, com aplicação dos conhecimentos em um CTF.',
      '/images/web-hacking.webp',
      'Workshop',
    ),
    activity(
      'machine-learning',
      'Machine Learning na prática',
      'Introdução à IA e à ciência de dados.',
      'Oficina de Machine Learning e Visão Computacional ministrada por Luis Felipe, reunindo fundamentos, dados e aplicações práticas.',
      '/images/machine-learning.webp',
      'Oficina',
    ),
    activity(
      'ctic',
      'CTIC Insight Conference 2026',
      'Tecnologia, conhecimento e troca.',
      'Participação da LASETE na conferência realizada na UEMA, com a palestra de Matheus Aguiar sobre segurança em aplicações web e APIs.',
      '/images/ctic.webp',
      'Conferência',
    ),
    activity(
      'giro',
      'Giro de Profissões',
      'Uma conversa sobre os caminhos da tecnologia.',
      'A LASETE participou do Giro de Profissões da UNDB, compartilhando conhecimentos e apresentando possibilidades em cibersegurança e tecnologias emergentes.',
      '/images/giro.webp',
      'Extensão',
    ),
    {
      id: 'midia-ctic',
      type: 'media',
      title: 'LASETE no CTIC Insight Conference 2026',
      subtitle: 'Segurança, tecnologia e troca de conhecimento na UEMA.',
      description:
        'Registro publicado no Instagram da LASETE sobre a participação da liga no CTIC Insight Conference 2026. Matheus Aguiar apresentou a palestra sobre segurança em aplicações web e APIs.',
      image: '/images/ctic.webp',
      url: 'https://www.instagram.com/lasete.undb/',
      category: 'Instagram da LASETE',
      published: true,
      postCrop: true,
    },
    {
      id: 'midia-giro',
      type: 'media',
      title: 'A liga no Giro de Profissões',
      subtitle:
        'Apresentando possibilidades em cibersegurança e tecnologias emergentes.',
      description:
        'Publicação da LASETE sobre sua participação no Giro de Profissões da UNDB, com troca de conhecimentos e apresentação da área de tecnologia aos estudantes.',
      image: '/images/giro.webp',
      url: 'https://www.instagram.com/lasete.undb/',
      category: 'Instagram da LASETE',
      published: true,
      postCrop: true,
    },
    {
      id: 'midia-web',
      type: 'media',
      title: 'Web Hacking no IT Works',
      subtitle: 'Um workshop que conectou metodologia e prática.',
      description:
        'Registro do workshop ministrado por Matheus Aguiar e da oportunidade de aplicar os conhecimentos em um CTF voltado à segurança de aplicações web.',
      image: '/images/web-hacking.webp',
      url: 'https://www.instagram.com/lasete.undb/',
      category: 'Instagram da LASETE',
      published: true,
      postCrop: true,
    },
    {
      id: 'material-privacidade',
      type: 'research',
      title: 'Privacidade e proteção de dados',
      subtitle:
        'Um material educativo sobre os impactos de uma exposição de dados.',
      description:
        'No carrossel enviado, a LASETE discute um caso de exposição de dados de um aplicativo, os impactos sobre as pessoas e a importância de construir soluções com foco em ética, privacidade e proteção de dados. Origem: material de divulgação publicado no Instagram da liga.',
      image: '/images/privacidade.webp',
      url: 'https://www.instagram.com/lasete.undb/',
      category: 'Material educativo · Privacidade',
      published: true,
      postCrop: true,
    },
    {
      id: 'material-ml',
      type: 'research',
      title: 'Machine Learning e Visão Computacional',
      subtitle: 'Fundamentos de IA e ciência de dados em uma oficina prática.',
      description:
        'Material de estudo e registro da oficina ministrada por Luis Felipe. Os temas divulgados incluem algoritmos de dados, regressão linear e introdução à visão computacional. Origem: publicação educativa no Instagram da liga.',
      image: '/images/machine-learning.webp',
      url: 'https://www.instagram.com/lasete.undb/',
      category: 'Material de estudo · IA',
      published: true,
      postCrop: true,
    },
    {
      id: 'material-ctf',
      type: 'research',
      title: 'Como funciona um Capture the Flag?',
      subtitle:
        'Desafios técnicos para aproximar o estudo da prática de segurança.',
      description:
        'O material apresentado pela liga explica o formato de uma competição CTF e registra desafios de reconhecimento, enumeração e aplicações web criados pelos membros da LASETE. Origem: publicação educativa no Instagram.',
      image: '/images/ctf-registro.webp',
      url: 'https://www.instagram.com/lasete.undb/',
      category: 'Material educativo · Segurança',
      published: true,
      postCrop: true,
    },
    {
      id: 'comunicado-liga',
      type: 'notice',
      title: 'Conheça a LASETE',
      subtitle: 'Uma comunidade de aprendizado, projetos, pesquisa e troca.',
      description:
        'A publicação de apresentação explica a proposta da Liga Acadêmica de Segurança e Tecnologias Emergentes da UNDB e suas iniciativas de ensino, pesquisa e extensão.',
      image: '/images/sobre-liga.webp',
      url: 'https://www.instagram.com/lasete.undb/',
      category: 'Sobre a liga · Instagram',
      published: true,
      postCrop: true,
    },
    {
      id: 'comunicado-ctf',
      type: 'notice',
      title: 'Aprender segurança com desafios',
      subtitle:
        'Conheça os registros do CTF desenvolvido pelos membros da liga.',
      description:
        'O CTF da LASETE colocou em prática etapas de reconhecimento, enumeração e exploração em um ambiente criado para o desafio. Conheça os registros nos canais da liga.',
      image: '/images/ctf-registro.webp',
      url: 'https://www.instagram.com/lasete.undb/',
      category: 'Projetos · Instagram',
      published: true,
      postCrop: true,
    },
    member(
      'luiz',
      'Luiz Felipe Cerqueira Guimarães',
      'Presidente',
      'Presidência',
      'Diretoria',
      '/images/luiz-felipe.webp',
    ),
    member(
      'pedro',
      'Pedro Henrique Serra Brasil',
      'Vice-presidente',
      'Vice-presidência',
      'Diretoria',
      '/images/pedro-brasil.webp',
    ),
    member(
      'joao',
      'João Gabriel Garcia',
      'Secretário-geral',
      'Secretaria',
      'Diretoria',
      '/images/joao-garcia.webp',
    ),
    member(
      'marcos-vinicius',
      'Marcos Vinícius Santos Silva',
      'Diretor de Pesquisa',
      'Pesquisa',
      'Diretoria',
      '/images/marcos-vinicius.webp',
    ),
    member(
      'gheorghe',
      'Gheorghe Marighella Lima Bastos',
      'Diretor de Ensino',
      'Ensino',
      'Diretoria',
      '/images/gheorghe.webp',
    ),
    member(
      'luiza',
      'Luiza Belfort Conceição dos Santos',
      'Diretora de Comunicação',
      'Comunicação',
      'Diretoria',
      '/images/luiza.webp',
    ),
    member(
      'luis-castro',
      'Luis Felipe da Cunha Castro',
      'Diretor de Extensão',
      'Extensão',
      'Diretoria',
      '/images/luis-castro.webp',
    ),
    member(
      'caio',
      'Caio Fontes Gondim Silva',
      'Ligante',
      'Extensão',
      'Ligantes',
    ),
    member(
      'daniel',
      'Daniel Augusto Pereira Amaral',
      'Ligante',
      'Extensão',
      'Ligantes',
    ),
    member('hugo', 'Hugo Carvalho Diniz', 'Ligante', 'Pesquisa', 'Ligantes'),
    member(
      'arthur',
      'Arthur Campos Rezende',
      'Ligante',
      'Pesquisa',
      'Ligantes',
    ),
    member(
      'marcos-eduardo',
      'Marcos Eduardo França Mesquita',
      'Ligante',
      'Comunicação',
      'Ligantes',
    ),
    member('matheus', 'Matheus Aguiar', 'Ligante', 'Ensino', 'Ligantes'),
    member(
      'nicolas',
      'Nicolas Mourão Mesquita',
      'Ligante',
      'Extensão',
      'Ligantes',
    ),
    member(
      'arlley',
      'Arlley Carlos Carneiro dos Santos Costa',
      'Professor orientador',
      'Orientação',
      'Orientadores',
    ),
    member(
      'rodrigo-almeida',
      'Rodrigo da Conceição Almeida',
      'Professor orientador',
      'Orientação',
      'Orientadores',
      '/images/rodrigo-almeida.webp',
    ),
    member(
      'rodrigo-justino',
      'Rodrigo Aparecido Justino',
      'Professor orientador',
      'Orientação',
      'Orientadores',
      '/images/rodrigo-justino.webp',
    ),
  ],
};
const STORAGE_KEY = 'lasete-preview-content-v1';
function isContentItem(value: unknown): value is ContentItem {
  if (!value || typeof value !== 'object') return false;
  const i = value as Record<string, unknown>;
  return (
    ['project', 'research', 'activity', 'media', 'member', 'notice'].includes(
      String(i.type),
    ) &&
    typeof i.id === 'string' &&
    typeof i.title === 'string' &&
    typeof i.published === 'boolean' &&
    ['subtitle', 'description', 'image', 'url', 'category'].every(
      (k) => typeof i[k] === 'string',
    )
  );
}
function withCanonicalAiLink(data: SiteData): SiteData {
  return {
    ...data,
    items: data.items.map((item) =>
      item.id === 'lasete-ai' ? { ...item, url: data.settings.aiUrl } : item,
    ),
  };
}
function loadData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (
        d.version === 1 &&
        Array.isArray(d.items) &&
        d.items.every(isContentItem) &&
        d.settings &&
        typeof d.settings.selectionOpen === 'boolean'
      )
        return withCanonicalAiLink({
          version: 1,
          items: d.items,
          settings: { ...initialData.settings, ...d.settings },
        });
    }
  } catch {}
  return structuredClone(initialData);
}
const ContentContext = createContext<{
  data: SiteData;
  save: (data: SiteData) => boolean;
  reset: () => boolean;
}>({ data: initialData, save: () => false, reset: () => false });
export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadData);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setData(loadData());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const save = useCallback((next: SiteData) => {
    try {
      const canonical = withCanonicalAiLink(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(canonical));
      setData(canonical);
      return true;
    } catch {
      return false;
    }
  }, []);
  const reset = useCallback(() => save(structuredClone(initialData)), [save]);
  return (
    <ContentContext.Provider value={{ data, save, reset }}>
      {children}
    </ContentContext.Provider>
  );
}
export function useContent() {
  return useContext(ContentContext);
}
export function usePublished(type: ContentType) {
  return useContent().data.items.filter((i) => i.type === type && i.published);
}
