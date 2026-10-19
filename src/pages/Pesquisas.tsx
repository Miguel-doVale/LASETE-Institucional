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
    <div className="research-page">
      <PageIntro
        ambient
        label="Pesquisas"
        title="Boas perguntas abrem caminhos."
        description="Pesquisa acadêmica e aprofundamento técnico para explorar as relações entre segurança, tecnologia e seus impactos reais."
      />
      <section className="shell research-results">
        <SectionHeading
          label="Pesquisas e materiais"
          title="Investigações e aprendizados da liga."
        />
        {items.length ? (
          <div className="project-grid">
            {items.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Um espaço para nossas pesquisas."
            description="Os trabalhos e as publicações disponibilizados pela LASETE serão reunidos aqui. Acompanhe os canais da liga ou converse com a equipe para saber mais."
          />
        )}
      </section>
      <section className="shell section-space research-fields">
        <SectionHeading
          label="Temas que dialogam com a liga"
          title="Da cibersegurança aos sistemas conectados."
        />
        <div className="research-field-grid">
          <div className="research-field" data-reveal>
            <span className="field-code">SEC</span>
            <h2>Segurança digital</h2>
            <p>
              Aplicações, redes e práticas para ambientes digitais mais seguros.
            </p>
          </div>
          <div className="research-field" data-reveal>
            <span className="field-code">IA</span>
            <h2>Inteligência artificial</h2>
            <p>
              Aprendizado de máquina, visão computacional e uso responsável de
              dados.
            </p>
          </div>
          <div className="research-field" data-reveal>
            <span className="field-code">IOT</span>
            <h2>Sistemas conectados</h2>
            <p>
              Dispositivos, sensores e os desafios de segurança da Internet das
              Coisas.
            </p>
          </div>
          <div className="research-field" data-reveal>
            <span className="field-code">PRIV</span>
            <h2>Privacidade</h2>
            <p>
              Proteção de dados, responsabilidade e ética em sistemas digitais.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
