import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ContentProvider } from './lib/content';
import { Layout } from './components/Layout';
const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() =>
  import('./pages/Pages').then((m) => ({ default: m.About })),
);
const Members = lazy(() =>
  import('./pages/Pages').then((m) => ({ default: m.Members })),
);
const Projects = lazy(() =>
  import('./pages/Pages').then((m) => ({ default: m.Projects })),
);
const Research = lazy(() =>
  import('./pages/Pages').then((m) => ({ default: m.Research })),
);
const Activities = lazy(() =>
  import('./pages/Pages').then((m) => ({ default: m.Activities })),
);
const Participate = lazy(() =>
  import('./pages/Pages').then((m) => ({ default: m.Participate })),
);
export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <Suspense
          fallback={
            <div className="route-loading" role="status">
              Abrindo a liga<span>...</span>
            </div>
          }
        >
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="a-liga" element={<About />} />
              <Route path="membros" element={<Members />} />
              <Route path="projetos" element={<Projects />} />
              <Route path="pesquisas" element={<Research />} />
              <Route path="atividades" element={<Activities />} />
              <Route path="participar" element={<Participate />} />
              <Route
                path="*"
                element={
                  <section className="not-found shell">
                    <span className="meta">404 / Caminho não encontrado</span>
                    <h1>
                      Vamos voltar
                      <br />
                      para a liga?
                    </h1>
                    <Link className="text-link" to="/">
                      Ir para a Home
                    </Link>
                  </section>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </ContentProvider>
    </BrowserRouter>
  );
}
