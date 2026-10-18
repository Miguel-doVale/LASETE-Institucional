import { useSearchParams } from 'react-router-dom';
import { usePublished } from '@/lib/content';
import { ContentCard, EmptyState, PageIntro } from '@/components/Shared';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function Atividades() {
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
        ambient
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
