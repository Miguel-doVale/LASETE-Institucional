import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Mail, FileText, LockKeyhole } from 'lucide-react';
import { Instagram, Linkedin } from '@/components/SocialIcons';
import { useContent, usePublished } from '@/lib/content';
import { safeUrl } from '@/lib/utils';
import {
  ContentCard,
  EmptyState,
  PageIntro,
  SectionHeading,
  safeImage,
} from '@/components/Shared';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProjectExplorer } from '@/components/Projects';
const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
export function About() {
  return (
    <>
      <PageIntro
        ambient
        label="A liga"
        title="A curiosidade encontra seu lugar."
        description="Uma iniciativa de estudantes da Escola de Tecnologia da UNDB para aprender, pesquisar e explorar novas possibilidades em segurança e tecnologias emergentes."
      />
      <section className="about-statement shell">
        <div className="about-photo post-crop">
          <img
            src="/images/comunidade.webp"
            alt="Comunidade da LASETE reunida na UNDB"
            loading="lazy"
          />
        </div>
        <div className="about-copy">
          <span className="section-label">A gente acredita na troca.</span>
          <h2>
            Aprender junto
            <br />
            faz diferença.
          </h2>
          <p>
            A LASETE integra estudantes que compartilham o interesse pela
            cibersegurança e pelas inovações tecnológicas. Um espaço de
            aprofundamento técnico, pesquisa científica e construção coletiva.
          </p>
          <p>
            Aqui, uma pergunta pode virar um grupo de estudo. Um encontro pode
            virar um projeto. E o que aprendemos pode ir mais longe quando é
            compartilhado.
          </p>
          <Link className="text-link" to="/membros">
            Conheça as pessoas
          </Link>
        </div>
      </section>
      <section className="shell section-space">
        <SectionHeading
          label="Nossa forma de fazer"
          title="Três frentes. A mesma vontade de ir além."
        />
        <div className="principle-rows">
          {[
            {
              symbol: '—',
              title: 'Ensino',
              copy: 'Aulas internas, oficinas e grupos de estudo que aproximam fundamentos e prática.',
              to: '/atividades',
            },
            {
              symbol: '+',
              title: 'Pesquisa',
              copy: 'Investigação acadêmica e aprofundamento técnico nas áreas de segurança e tecnologias emergentes.',
              to: '/pesquisas',
            },
            {
              symbol: '✳',
              title: 'Extensão',
              copy: 'Organização e participação em eventos para levar o conhecimento à comunidade.',
              to: '/atividades',
            },
          ].map((p) => (
            <Link to={p.to} key={p.title} data-reveal>
              <span className="principle-symbol" aria-hidden="true">
                {p.symbol}
              </span>
              <h3>{p.title}</h3>
              <p>{p.copy}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="manifesto">
        <div className="shell">
          <span className="section-label">
            Da sala de aula para novas possibilidades.
          </span>
          <h2>
            Investigar com curiosidade.
            <br />
            Construir com responsabilidade.
            <br />
            <span>Compartilhar para transformar.</span>
          </h2>
          <p>Segurança, ética e colaboração fazem parte dessa conversa.</p>
        </div>
      </section>
    </>
  );
}
export function Members() {
  const people = usePublished('member');
  const [group, setGroup] = useState('Diretoria');
  const [query, setQuery] = useState('');
  const filtered = people.filter(
    (i) =>
      (group === 'Todos' || i.group === group) &&
      normalize(`${i.title} ${i.role} ${i.area}`).includes(normalize(query)),
  );
  return (
    <>
      <PageIntro
        ambient
        label="Membros"
        title="Quem faz a liga acontecer."
        description="Pessoas com diferentes perguntas e uma vontade em comum: aprender, criar e compartilhar conhecimento."
      />
      <section className="shell members-section">
        <div className="members-toolbar">
          <Tabs value={group} onValueChange={setGroup}>
            <TabsList aria-label="Filtrar membros por grupo">
              {['Diretoria', 'Ligantes', 'Orientadores', 'Todos'].map((g) => (
                <TabsTrigger key={g} value={g}>
                  {g}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <label className="search-field">
            <Search size={16} />
            <span className="sr-only">Buscar membro</span>
            <input
              placeholder="Encontre uma pessoa"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <p className="results-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'pessoa' : 'pessoas'} ·{' '}
          {group}
        </p>
        <div className="member-grid">
          {filtered.map((person) => (
            <article className="member-card" key={person.id} data-reveal>
              <div className="member-photo">
                {person.image ? (
                  <img
                    src={safeImage(person.image)}
                    alt={person.title}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div
                    className="member-initials"
                    aria-label="Retrato ainda não disponível"
                  >
                    <span>
                      {person.title
                        .split(' ')
                        .filter(Boolean)
                        .map((p, i, a) =>
                          i === 0 || i === a.length - 1 ? p[0] : '',
                        )
                        .join('')}
                    </span>
                    <small>LASETE / {person.area}</small>
                  </div>
                )}
                <span className="member-area">{person.area}</span>
              </div>
              <h2>{person.title}</h2>
              <p>{person.role || person.subtitle}</p>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <EmptyState
            title="Vamos tentar outro nome?"
            description="Nenhuma pessoa corresponde à busca. Você pode trocar o grupo ou buscar por uma área."
          />
        )}
        {group === 'Diretoria' && (
          <p className="members-note">
            Diretoria financeira: responsável a confirmar.
          </p>
        )}
      </section>
    </>
  );
}
export function Projects() {
  const items = usePublished('project');
  return (
    <>
      <PageIntro
        ambient
        label="Projetos"
        title="Conhecimento em construção."
        description="Explore as iniciativas da LASETE. Conheça cada projeto, veja o que foi experimentado e encontre um caminho para continuar a conversa."
      />
      <section className="shell project-page">
        {items.length ? (
          <ProjectExplorer items={items} />
        ) : (
          <EmptyState
            title="Novas ideias encontram espaço aqui."
            description="Os projetos disponibilizados pela liga aparecerão neste catálogo."
          />
        )}
      </section>
    </>
  );
}
export function Research() {
  const items = usePublished('research');
  return (
    <>
      <PageIntro
        label="Pesquisas"
        title="Boas perguntas abrem caminhos."
        description="Pesquisa acadêmica e aprofundamento técnico para explorar as relações entre segurança, tecnologia e seus impactos reais."
      />
      <section className="shell research-fields">
        <span className="section-label">Um território para investigar</span>
        <div className="research-field" data-reveal>
          <span className="field-code">SEC</span>
          <h2>Segurança da informação</h2>
          <p>
            Aplicações, redes e os desafios de construir ambientes digitais mais
            seguros.
          </p>
        </div>
        <div className="research-field" data-reveal>
          <span className="field-code">AI</span>
          <h2>Inteligência artificial</h2>
          <p>
            Aprendizado de máquina, dados e novas possibilidades para a
            tecnologia.
          </p>
        </div>
        <div className="research-field" data-reveal>
          <span className="field-code">PRIV</span>
          <h2>Privacidade e proteção de dados</h2>
          <p>
            Responsabilidade e ética na relação entre pessoas e sistemas
            digitais.
          </p>
        </div>
      </section>
      <section className="shell section-space">
        <SectionHeading
          label="Estudos e materiais"
          title="Conhecimento para compartilhar."
        />
        {items.length ? (
          <div className="project-grid">
            {items.map((i) => (
              <ContentCard key={i.id} item={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Um espaço para nossas pesquisas."
            description="Os trabalhos e as publicações disponibilizados pela LASETE serão reunidos aqui. Acompanhe os canais da liga ou converse com a equipe para saber mais."
          />
        )}
      </section>
    </>
  );
}
export function Activities() {
  const activities = usePublished('activity'),
    media = usePublished('media'),
    notices = usePublished('notice');
  const [params, setParams] = useSearchParams();
  const tab = ['atividades', 'midia', 'comunicados'].includes(
    params.get('aba') || '',
  )
    ? params.get('aba')!
    : 'atividades';
  return (
    <>
      <PageIntro
        label="Atividades"
        title="Conhecimento que sai do lugar."
        description="Aulas, encontros, eventos e histórias que conectam a LASETE com a comunidade. A liga em movimento, dentro e fora da UNDB."
      />
      <section className="shell activities-section">
        <Tabs
          value={tab}
          onValueChange={(value) =>
            setParams({ aba: value }, { replace: true })
          }
        >
          <TabsList aria-label="Explorar atividades e mídia">
            <TabsTrigger value="atividades">Atividades</TabsTrigger>
            <TabsTrigger value="midia">LASETE na mídia</TabsTrigger>
            <TabsTrigger value="comunicados">Comunicados</TabsTrigger>
          </TabsList>
          <TabsContent value="atividades">
            <div className="activity-grid">
              {activities.map((i) => (
                <ContentCard key={i.id} item={i} />
              ))}
            </div>
            {!activities.length && (
              <EmptyState
                title="A próxima troca começa aqui."
                description="Os registros e a programação de atividades serão reunidos neste espaço."
              />
            )}
          </TabsContent>
          <TabsContent value="midia">
            <div className="tab-intro">
              <span className="section-label">A liga em circulação</span>
              <h2>LASETE na mídia.</h2>
              <p>
                Registros publicados nos nossos canais, participações e menções
                à liga. Cada conteúdo identifica sua fonte para você continuar a
                conversa.
              </p>
            </div>
            {media.length ? (
              <div className="activity-grid">
                {media.map((i) => (
                  <ContentCard key={i.id} item={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="As próximas menções ganham lugar aqui."
                description="Quando uma publicação sobre a LASETE for adicionada, você encontrará o veículo e o acesso à fonte original neste espaço."
              />
            )}
          </TabsContent>
          <TabsContent value="comunicados">
            <div className="tab-intro">
              <h2>Fique por dentro.</h2>
              <p>Informações, oportunidades e avisos da liga em um só lugar.</p>
            </div>
            {notices.length ? (
              <div className="activity-grid">
                {notices.map((i) => (
                  <ContentCard key={i.id} item={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Os avisos da liga aparecem aqui."
                description="Acompanhe também o Instagram e a página Participar para informações sobre o processo seletivo."
              />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
export function Participate() {
  const { data } = useContent();
  const s = data.settings;
  return (
    <>
      <header id="contato" className="shell participate-intro">
        <div>
          <span className="section-label">Participar e contato</span>
          <h1>Vamos conversar.</h1>
          <p>
            Quer fazer parte da liga, propor uma atividade ou saber mais sobre o
            que estamos construindo? Fale com a LASETE.
          </p>
          <a className="text-link" href="#seletivo">
            Consultar processo seletivo
          </a>
        </div>
        <div className="contact-links" aria-label="Canais de contato">
          <a href={`mailto:${s.email}`}>
            <Mail size={23} strokeWidth={1.5} />
            <div>
              <span>E-mail</span>
              <small>{s.email}</small>
            </div>
          </a>
          <a href={safeUrl(s.instagram)} target="_blank" rel="noreferrer">
            <Instagram size={23} />
            <div>
              <span>Instagram</span>
              <small>Atividades, registros e novidades</small>
            </div>
          </a>
          <a href={safeUrl(s.linkedin)} target="_blank" rel="noreferrer">
            <Linkedin size={23} />
            <div>
              <span>LinkedIn</span>
              <small>Conexões e iniciativas da liga</small>
            </div>
          </a>
        </div>
      </header>
      <section
        id="seletivo"
        data-reveal
        className={`selection-banner shell ${s.selectionOpen ? 'selection-open' : 'selection-closed'}`}
        aria-labelledby="selection-heading"
      >
        <div className="selection-top">
          <span className="selection-label">
            <span className="status-dot" />
            Processo seletivo
          </span>
          {s.selectionOpen ? (
            <span>Venha fazer parte.</span>
          ) : (
            <LockKeyhole size={23} strokeWidth={1.5} />
          )}
        </div>
        <h2 id="selection-heading">
          {s.selectionOpen ? (
            <>
              INSCRIÇÕES
              <br />
              <span>ABERTAS.</span>
            </>
          ) : (
            <>
              SELETIVO
              <br />
              <span>FECHADO.</span>
            </>
          )}
        </h2>
        <div className="selection-bottom">
          <p>
            {s.selectionOpen
              ? 'Venha aprender, pesquisar e construir com a LASETE. Confira o edital e participe do processo seletivo.'
              : 'As inscrições estão encerradas. Conheça o edital e acompanhe nossos canais para saber quando a próxima oportunidade chegar.'}
          </p>
          <div className="selection-actions">
            <Button asChild variant="outline">
              <a href={safeUrl(s.editalUrl)} target="_blank" rel="noreferrer">
                <FileText size={17} />
                Ler edital
              </a>
            </Button>
            <Button asChild>
              <a href={safeUrl(s.formUrl)} target="_blank" rel="noreferrer">
                {s.selectionOpen ? 'Inscreva-se' : 'Consultar formulário'}
              </a>
            </Button>
          </div>
        </div>
      </section>
      <section className="shell participation-details" data-reveal>
        <h2>Antes de participar</h2>
        <div>
          <p>{s.selectionNote}</p>
          <p>
            Ficou com alguma dúvida? Entre em contato pelos canais acima. Você
            também pode conhecer as pessoas, as iniciativas e as atividades da
            LASETE pelo site.
          </p>
          <Link className="text-link" to="/a-liga">
            Conheça a LASETE
          </Link>
        </div>
      </section>
    </>
  );
}
