import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/*
 * THESIS: A clear recovery, with the ASCII language of the LASETE opening.
 * OWN-WORLD: Inherit the neutral palette, Geist, navigation and existing buttons.
 * STORY: Recognize the missing page and return home or reach the league.
 * FIRST VIEWPORT: ASCII 404 beside the message and two immediate recovery links.
 * FORM: A narrow error state within the established public layout.
 */
const digits = [
  ['10001', '10001', '10001', '11111', '00001', '00001', '00001'],
  ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
];
const ascii404 = Array.from({ length: 7 }, (_, row) =>
  [0, 1, 0]
    .map((digit) =>
      [...digits[digit][row]]
        .map((pixel) => (pixel === '1' ? '01' : '  '))
        .join(''),
    )
    .join('    '),
).join('\n');

export default function NotFound() {
  const { pathname } = useLocation();
  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.append(robots);
    return () => robots.remove();
  }, []);

  return (
    <section className="not-found shell" aria-labelledby="not-found-title">
      <pre className="not-found-visual" aria-hidden="true">
        {ascii404}
      </pre>
      <div className="not-found-copy">
        <span className="section-label">Erro 404</span>
        <h1 id="not-found-title">Página não encontrada.</h1>
        <p>
          O endereço pode ter mudado ou não existir. Volte ao início ou fale com
          a liga para encontrar o que precisa.
        </p>
        <div className="not-found-actions">
          <Button asChild>
            <Link to="/">Voltar à Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/participar#contato">Falar com a LASETE</Link>
          </Button>
        </div>
        <p className="not-found-path">
          <span>Endereço solicitado</span>
          <code>{pathname}</code>
        </p>
      </div>
    </section>
  );
}
