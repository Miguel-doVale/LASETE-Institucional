import { usePublished } from '@/lib/content';
import {
  ContentCard,
  EmptyState,
  PageIntro,
  SectionHeading,
} from '@/components/Shared';

export default function Pesquisas() {
  const items = usePublished('research');
  return (
    <>
      <PageIntro
        ambient
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
