import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  Search,
  FileText,
  Users,
  FolderCode,
  Newspaper,
  Microscope,
  CalendarDays,
  Megaphone,
  Settings2,
  FlaskConical,
  Eye,
  EyeOff,
  ImagePlus,
} from 'lucide-react';
import { Brand } from '@/components/Brand';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { safeUrl } from '@/lib/utils';
import { safeImage } from '@/components/Shared';
import {
  useContent,
  type ContentItem,
  type ContentType,
  type Settings,
} from '@/lib/content';
const modules = [
  { type: 'project', label: 'Projetos', singular: 'projeto', icon: FolderCode },
  {
    type: 'research',
    label: 'Pesquisas',
    singular: 'pesquisa',
    icon: Microscope,
  },
  {
    type: 'activity',
    label: 'Atividades',
    singular: 'atividade',
    icon: CalendarDays,
  },
  { type: 'member', label: 'Membros', singular: 'membro', icon: Users },
  {
    type: 'media',
    label: 'LASETE na mídia',
    singular: 'menção na mídia',
    icon: Newspaper,
  },
  {
    type: 'notice',
    label: 'Comunicados',
    singular: 'comunicado',
    icon: Megaphone,
  },
] as const;
type Module = ContentType | 'selection' | 'contact';
function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export default function Admin() {
  const { data, save, reset } = useContent();
  const [module, setModule] = useState<Module>('project');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [deleting, setDeleting] = useState<ContentItem | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(data.settings);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    document.title = 'Painel de demonstração · LASETE';
  }, []);
  useEffect(() => setSettings(data.settings), [data.settings]);
  const current = modules.find((m) => m.type === module);
  const list = data.items.filter(
    (i) =>
      i.type === module &&
      `${i.title} ${i.subtitle} ${i.category}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  const navigate = (m: Module) => {
    setModule(m);
    setQuery('');
    setError('');
    setNotice('');
  };
  const persist = (next: typeof data) => {
    if (!save(next)) {
      setError(
        'Não foi possível salvar no navegador. Tente uma imagem menor ou libere espaço de armazenamento.',
      );
      return false;
    }
    setNotice('Alterações salvas neste navegador.');
    setError('');
    return true;
  };
  const updateItem = (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const item = {
      ...editing,
      title: editing.title.trim(),
      subtitle: editing.subtitle.trim(),
    };
    if (!item.title) {
      setError('Informe um título ou nome.');
      return;
    }
    if (item.url && !safeUrl(item.url)) {
      setError('Use um endereço HTTPS válido ou um caminho do próprio site.');
      return;
    }
    if (item.type === 'member') {
      item.role = item.subtitle;
      item.area = item.category;
    }
    const exists = data.items.some((i) => i.id === item.id);
    const items = exists
      ? data.items.map((i) => (i.id === item.id ? item : i))
      : [item, ...data.items];
    if (item.id === 'lasete-ai' && !safeUrl(item.url)) {
      setError('Informe um link válido para acessar a LASETE AI.');
      return;
    }
    const nextSettings =
      item.id === 'lasete-ai'
        ? { ...data.settings, aiUrl: item.url }
        : data.settings;
    if (persist({ ...data, items, settings: nextSettings })) setEditing(null);
  };
  const create = () => {
    if (!current) return;
    setError('');
    setEditing({
      id: crypto.randomUUID(),
      type: current.type,
      title: '',
      subtitle: '',
      description: '',
      image: '',
      url: '',
      category: '',
      published: false,
      ...(current.type === 'member' ? { group: 'Ligantes' } : {}),
    });
  };
  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Escolha uma imagem JPG, PNG ou WebP.');
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem precisa ter até 2 MB. Escolha um arquivo menor.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setEditing((old) =>
        old ? { ...old, image: String(reader.result), postCrop: false } : old,
      );
      setError('');
    };
    reader.onerror = () =>
      setError('Não foi possível ler essa imagem. Tente novamente.');
    reader.readAsDataURL(file);
  };
  const saveSettings = (event: FormEvent) => {
    event.preventDefault();
    const urls =
      module === 'selection'
        ? [settings.editalUrl, settings.formUrl]
        : [settings.instagram, settings.linkedin, settings.aiUrl];
    if (urls.some((u) => !safeUrl(u))) {
      setError('Preencha os links com endereços HTTPS válidos.');
      return;
    }
    persist({ ...data, settings });
  };
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" aria-label="Voltar à Home">
          <Brand />
        </Link>
        <span className="admin-sidebar-label">Painel editorial</span>
        <nav aria-label="Seções do painel">
          {modules.map((m) => (
            <button
              key={m.type}
              className={module === m.type ? 'active' : ''}
              onClick={() => navigate(m.type)}
            >
              <m.icon size={17} />
              {m.label}
              <span>{data.items.filter((i) => i.type === m.type).length}</span>
            </button>
          ))}
          <div className="admin-nav-divider" />
          <button
            onClick={() => navigate('selection')}
            className={module === 'selection' ? 'active' : ''}
          >
            <FileText size={17} />
            Processo seletivo
          </button>
          <button
            onClick={() => navigate('contact')}
            className={module === 'contact' ? 'active' : ''}
          >
            <Settings2 size={17} />
            Contatos e links
          </button>
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/" className="text-link">
            Visualizar site
          </Link>
          <button className="reset-button" onClick={() => setResetOpen(true)}>
            Restaurar dados iniciais
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <span className="meta">LASETE / Conteúdo</span>
          <span className="demo-tag">
            <FlaskConical size={13} />
            Demonstração
          </span>
        </div>
        <aside className="demo-notice">
          <FlaskConical size={20} />
          <div>
            <strong>Uma prévia do seu painel.</strong>
            <p>
              As alterações ficam apenas neste navegador. Login, permissões e
              armazenamento compartilhado entram na integração com Supabase.
            </p>
          </div>
        </aside>
        <div className="admin-page-heading">
          <div>
            <span className="section-label">Tudo no seu lugar.</span>
            <h1>
              {current?.label ||
                (module === 'selection'
                  ? 'Processo seletivo'
                  : 'Contatos e links')}
            </h1>
          </div>
          {current && (
            <Button onClick={create}>
              <Plus size={17} />
              Adicionar {current.singular}
            </Button>
          )}
        </div>
        <div
          role="status"
          className={`admin-feedback ${notice ? 'is-visible' : ''}`}
        >
          {notice && (
            <>
              <Check size={16} />
              {notice}
            </>
          )}
        </div>
        {current ? (
          <>
            <div className="admin-list-toolbar">
              <p>
                {list.length} {list.length === 1 ? 'registro' : 'registros'}
              </p>
              <label className="search-field">
                <Search size={16} />
                <span className="sr-only">Buscar conteúdo</span>
                <input
                  placeholder="Buscar conteúdo"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{module === 'member' ? 'Pessoa' : 'Título'}</th>
                    <th>Status</th>
                    <th>
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="admin-item-title">
                          <div className="admin-thumbnail">
                            {item.image ? (
                              <img src={safeImage(item.image)} alt="" />
                            ) : (
                              <FileText size={20} />
                            )}
                          </div>
                          <div>
                            <strong>{item.title}</strong>
                            <small>{item.subtitle || item.category}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`publication-status ${item.published ? 'published' : ''}`}
                        >
                          <span />
                          {item.published ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            aria-label={`Editar ${item.title}`}
                            onClick={() => {
                              setEditing({ ...item });
                              setError('');
                            }}
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            aria-label={`${item.published ? 'Despublicar' : 'Publicar'} ${item.title}`}
                            onClick={() =>
                              persist({
                                ...data,
                                items: data.items.map((i) =>
                                  i.id === item.id
                                    ? { ...i, published: !i.published }
                                    : i,
                                ),
                              })
                            }
                          >
                            {item.published ? (
                              <EyeOff size={17} />
                            ) : (
                              <Eye size={17} />
                            )}
                          </button>
                          <button
                            className="delete-button"
                            aria-label={`Excluir ${item.title}`}
                            onClick={() => setDeleting(item)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!list.length && (
                <div className="admin-empty">
                  <current.icon size={32} strokeWidth={1} />
                  <h2>
                    {query
                      ? 'Nenhum resultado para essa busca.'
                      : 'O próximo conteúdo começa aqui.'}
                  </h2>
                  <p>
                    {query
                      ? 'Tente buscar por outro título ou categoria.'
                      : `Adicione ${current.singular} para testar a publicação no site.`}
                  </p>
                  {!query && (
                    <Button variant="outline" onClick={create}>
                      <Plus size={16} />
                      Adicionar {current.singular}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <form className="admin-settings-form" onSubmit={saveSettings}>
            {module === 'selection' ? (
              <>
                <div className="selection-setting">
                  <div>
                    <h2>Inscrições abertas</h2>
                    <p>
                      Controla o aviso grande e o botão de inscrição na página
                      Participar.
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      aria-label="Seletivo aberto"
                      type="checkbox"
                      checked={settings.selectionOpen}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          selectionOpen: e.target.checked,
                        })
                      }
                    />
                    <span />
                  </label>
                </div>
                <div
                  className={`admin-selection-preview ${settings.selectionOpen ? 'open' : ''}`}
                >
                  <span className="meta">Prévia da mensagem</span>
                  <strong>
                    {settings.selectionOpen
                      ? 'INSCRIÇÕES ABERTAS.'
                      : 'SELETIVO FECHADO.'}
                  </strong>
                </div>
                <p className="field-help">
                  Esse controle muda o aviso no site. A abertura ou o fechamento
                  do Google Forms é feito no próprio formulário.
                </p>
                <Field label="Link do edital">
                  <input
                    type="url"
                    required
                    value={settings.editalUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, editalUrl: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Link do formulário de inscrição"
                  hint="O link continua disponível para consulta quando o seletivo está fechado."
                >
                  <input
                    type="url"
                    required
                    value={settings.formUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, formUrl: e.target.value })
                    }
                  />
                </Field>
                <Field label="Orientações complementares">
                  <textarea
                    rows={3}
                    maxLength={600}
                    value={settings.selectionNote}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        selectionNote: e.target.value,
                      })
                    }
                  />
                </Field>
              </>
            ) : (
              <>
                <Field label="E-mail de contato">
                  <input
                    type="email"
                    required
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                  />
                </Field>
                <Field label="Instagram">
                  <input
                    type="url"
                    required
                    value={settings.instagram}
                    onChange={(e) =>
                      setSettings({ ...settings, instagram: e.target.value })
                    }
                  />
                </Field>
                <Field label="LinkedIn">
                  <input
                    type="url"
                    required
                    value={settings.linkedin}
                    onChange={(e) =>
                      setSettings({ ...settings, linkedin: e.target.value })
                    }
                  />
                </Field>
                <Field label="LASETE AI">
                  <input
                    type="url"
                    required
                    value={settings.aiUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, aiUrl: e.target.value })
                    }
                  />
                </Field>
              </>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="admin-form-actions">
              <Button type="submit">
                <Check size={17} />
                Salvar alterações
              </Button>
              <Link
                className="text-link"
                to={module === 'selection' ? '/participar' : '/'}
              >
                Ver no site
              </Link>
            </div>
          </form>
        )}
        {error && current && !editing && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </main>
      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
            setError('');
          }
        }}
      >
        <DialogContent className="editor-dialog">
          <DialogTitle>
            {editing && data.items.some((i) => i.id === editing.id)
              ? 'Editar conteúdo'
              : 'Adicionar conteúdo'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações e confira o status de publicação.
          </DialogDescription>
          {editing && (
            <form onSubmit={updateItem} className="editor-form">
              <Field
                label={editing.type === 'member' ? 'Nome completo' : 'Título'}
              >
                <input
                  autoFocus
                  required
                  maxLength={160}
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                />
              </Field>
              <Field label={editing.type === 'member' ? 'Cargo' : 'Subtítulo'}>
                <input
                  maxLength={240}
                  value={editing.subtitle}
                  onChange={(e) =>
                    setEditing({ ...editing, subtitle: e.target.value })
                  }
                />
              </Field>
              {editing.type === 'member' && (
                <Field label="Grupo">
                  <select
                    value={editing.group || 'Ligantes'}
                    onChange={(e) =>
                      setEditing({ ...editing, group: e.target.value })
                    }
                  >
                    <option>Diretoria</option>
                    <option>Ligantes</option>
                    <option>Orientadores</option>
                  </select>
                </Field>
              )}
              <Field
                label={
                  editing.type === 'member'
                    ? 'Área'
                    : editing.type === 'media'
                      ? 'Veículo de comunicação'
                      : 'Categoria'
                }
              >
                <input
                  maxLength={100}
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                />
              </Field>
              {editing.type !== 'member' && (
                <>
                  <Field label="Descrição">
                    <textarea
                      rows={4}
                      maxLength={4000}
                      value={editing.description}
                      onChange={(e) =>
                        setEditing({ ...editing, description: e.target.value })
                      }
                    />
                  </Field>
                  <Field
                    label="Link de direcionamento"
                    hint="Endereço HTTPS ou caminho de uma página do site."
                  >
                    <input
                      required={
                        editing.type === 'media' || editing.type === 'notice'
                      }
                      value={editing.url}
                      onChange={(e) =>
                        setEditing({ ...editing, url: e.target.value })
                      }
                      placeholder="https://"
                    />
                  </Field>
                </>
              )}
              <div className="image-upload-field">
                <span>Imagem</span>
                {editing.image && (
                  <img
                    className="upload-preview"
                    src={safeImage(editing.image)}
                    alt="Prévia da imagem selecionada"
                  />
                )}
                <label className="upload-control">
                  <ImagePlus size={18} />
                  <span>
                    {editing.image ? 'Trocar imagem' : 'Escolher imagem'}
                  </span>
                  <input
                    type="file"
                    aria-label="Escolher imagem"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={upload}
                  />
                </label>
                <small>JPG, PNG ou WebP · até 2 MB nesta demonstração.</small>
              </div>
              <label className="publish-checkbox">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) =>
                    setEditing({ ...editing, published: e.target.checked })
                  }
                />
                <span>Publicado no site</span>
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="admin-form-actions">
                <Button type="submit">
                  <Check size={16} />
                  Salvar conteúdo
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Excluir este conteúdo?</DialogTitle>
          <DialogDescription>
            {deleting?.title} será removido desta demonstração.
          </DialogDescription>
          <div className="admin-form-actions">
            <Button
              onClick={() => {
                if (
                  deleting &&
                  persist({
                    ...data,
                    items: data.items.filter((i) => i.id !== deleting.id),
                  })
                )
                  setDeleting(null);
              }}
            >
              Excluir conteúdo
            </Button>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogTitle>Voltar ao ponto de partida?</DialogTitle>
          <DialogDescription>
            As edições locais serão substituídas pelos conteúdos iniciais da
            prévia.
          </DialogDescription>
          <div className="admin-form-actions">
            <Button
              onClick={() => {
                if (reset()) {
                  setResetOpen(false);
                  setNotice('Dados iniciais restaurados.');
                } else setError('Não foi possível restaurar os dados.');
              }}
            >
              Restaurar dados
            </Button>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
