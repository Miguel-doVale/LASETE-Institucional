import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePointerHighlight } from '@/lib/pointer-highlight';
import { memberGroups, orderMembers } from '@/lib/member-order';
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
  LogOut,
  ArrowUpRight,
  LoaderCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  ImagePlus,
} from 'lucide-react';
import AdminAccess from './AdminAccess';
import { Matrix } from '@/components/Matrix';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
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
  useEffect(() => {
    document.title = 'Painel editorial · LASETE';
  }, []);
  return (
    <AdminAccess>
      <AdminPanel />
    </AdminAccess>
  );
}
function AdminPanel() {
  usePointerHighlight('.admin-shell, .editor-dialog');
  const { data, save, loading, loadError, reload } = useContent();
  const { session } = useAuth();
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [params, setParams] = useSearchParams();
  const storageKey = `lasete-admin-view:${session?.user.id}`;
  const [view, setView] = useState(() => {
    let initial = params;
    if (!params.has('section')) {
      try {
        initial = new URLSearchParams(
          sessionStorage.getItem(storageKey) || params.toString(),
        );
      } catch {}
    }
    return {
      section: initial.get('section') || 'project',
      q: initial.get('q') || '',
      status: initial.get('status') || 'all',
      group: initial.get('group') || 'Todos',
    };
  });
  const module: Module = [
    ...modules.map((m) => m.type),
    'selection',
    'contact',
  ].includes(view.section)
    ? (view.section as Module)
    : 'project';
  const query = view.q;
  const statusFilter = view.status;
  const memberGroup = view.group;
  const updateView = (patch: Partial<typeof view>) =>
    setView((previous) => ({ ...previous, ...patch }));
  const setQuery = (q: string) => updateView({ q });
  const setStatusFilter = (status: string) => updateView({ status });
  useEffect(() => {
    const next = new URLSearchParams({ ...view, section: module });
    try {
      sessionStorage.setItem(storageKey, next.toString());
    } catch {}
    if (params.toString() !== next.toString())
      setParams(next, { replace: true });
  }, [storageKey, view, module, params, setParams]);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [deleting, setDeleting] = useState<ContentItem | null>(null);
  const [settings, setSettings] = useState<Settings>(data.settings);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    document.title = 'Painel editorial · LASETE';
  }, []);
  useEffect(() => setSettings(data.settings), [data.settings]);
  const current = modules.find((m) => m.type === module);
  const matches = data.items.filter(
    (i) =>
      i.type === module &&
      (module !== 'member' ||
        memberGroup === 'Todos' ||
        i.group === memberGroup) &&
      (statusFilter === 'all' ||
        (statusFilter === 'published' ? i.published : !i.published)) &&
      `${i.title} ${i.subtitle} ${i.category}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  const list = module === 'member' ? orderMembers(matches) : matches;
  const navigate = (m: Module) => {
    updateView({ section: m, q: '', status: 'all', group: 'Todos' });
    setError('');
    setNotice('');
  };
  const persist = async (next: typeof data) => {
    if (busy) return false;
    setBusy(true);
    const saved = await save(next);
    setBusy(false);
    if (!saved) {
      setError(
        'Não foi possível salvar. Confira sua conexão e sua permissão de administrador e tente novamente.',
      );
      return false;
    }
    setNotice('Alterações salvas no site.');
    setError('');
    return true;
  };
  const updateItem = async (event: FormEvent) => {
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
    if (await persist({ ...data, items, settings: nextSettings }))
      setEditing(null);
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
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !supabase || !editing) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Escolha uma imagem JPG, PNG ou WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem precisa ter até 5 MB. Escolha um arquivo menor.');
      return;
    }
    const itemId = editing.id;
    setUploading(true);
    setError('');
    try {
      const extension = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      }[file.type];
      const path = `${editing.type}/${itemId}/${crypto.randomUUID()}.${extension}`;
      const { error: failure } = await supabase.storage
        .from('lasete-images')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (failure) throw failure;
      const { data: image } = supabase.storage
        .from('lasete-images')
        .getPublicUrl(path);
      setEditing((old) =>
        old?.id === itemId
          ? { ...old, image: image.publicUrl, postCrop: false }
          : old,
      );
    } catch {
      setError(
        'Não foi possível enviar a imagem. Confira sua conexão e tente novamente.',
      );
    } finally {
      setUploading(false);
    }
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
  const moduleItems = data.items.filter((i) => i.type === module);
  const publishedCount = moduleItems.filter((i) => i.published).length;
  const logout = async () => {
    setBusy(true);
    try {
      const { error: failure } = await supabase!.auth.signOut();
      if (failure) throw failure;
    } catch {
      setError('Não foi possível sair. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="admin-shell">
      <div className="admin-ambient" data-matrix="hero" aria-hidden="true" />
      <Matrix route="/admin/workspace" intensity={2} />
      <aside className="admin-sidebar">
        <Link to="/" aria-label="Voltar à Home">
          <Brand />
        </Link>
        <span className="admin-sidebar-label">Gerenciar conteúdo</span>
        <nav aria-label="Seções do painel">
          {modules.map((m) => (
            <button
              key={m.type}
              aria-current={module === m.type ? 'page' : undefined}
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
          <div className="admin-account">
            <span className="admin-avatar">
              {session?.user.email?.[0]?.toUpperCase() || 'L'}
            </span>
            <div>
              <strong>Administrador</strong>
              <small>{session?.user.email}</small>
            </div>
          </div>
          <button className="admin-signout" onClick={logout} disabled={busy}>
            <LogOut size={16} /> Sair da conta
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <span className="meta">LASETE / Conteúdo</span>
          <Link to="/" className="admin-site-link">
            Visualizar site <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="admin-workspace-label">
          <ShieldCheck size={16} /> Espaço da diretoria
        </div>
        <div className="admin-page-heading">
          <div>
            <span className="section-label">Painel editorial</span>
            <h1>
              {current?.label ||
                (module === 'selection'
                  ? 'Processo seletivo'
                  : 'Contatos e links')}
            </h1>
          </div>
          {current && (
            <Button onClick={create} disabled={busy || loading || !!loadError}>
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
        {loadError ? (
          <div className="access-message" role="alert">
            <strong>Os conteúdos não carregaram</strong>
            <p>{loadError}</p>
            <Button onClick={reload}>Tentar novamente</Button>
          </div>
        ) : loading ? (
          <div className="access-loading" role="status">
            <LoaderCircle className="admin-spinner" size={20} /> Carregando
            conteúdos…
          </div>
        ) : current ? (
          <>
            <p className="admin-module-description">
              {module === 'member'
                ? 'As pessoas que fazem a liga acontecer.'
                : `Organize ${current.label.toLocaleLowerCase()} e escolha o que aparece no site.`}
            </p>
            {module === 'member' && (
              <Tabs
                value={memberGroup}
                onValueChange={(group) => updateView({ group })}
                className="admin-member-tabs"
              >
                <TabsList aria-label="Filtrar membros por grupo">
                  {memberGroups.map((group) => (
                    <TabsTrigger key={group} value={group}>
                      {group}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
            <div className="admin-list-toolbar">
              <div
                className="admin-status-filter"
                role="group"
                aria-label="Filtrar por publicação"
              >
                {[
                  ['all', 'Todos', moduleItems.length],
                  ['published', 'Publicados', publishedCount],
                  ['draft', 'Rascunhos', moduleItems.length - publishedCount],
                ].map(([value, label, count]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={statusFilter === value}
                    onClick={() => setStatusFilter(String(value))}
                  >
                    {label}
                    <span>{count}</span>
                  </button>
                ))}
              </div>

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
                            disabled={busy}
                            aria-label={`Editar ${item.title}`}
                            onClick={() => {
                              setEditing({ ...item });
                              setError('');
                            }}
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            disabled={busy}
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
                            disabled={busy}
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
                      : `Adicione ${current.singular} para publicar no site.`}
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
            <fieldset disabled={busy} className="admin-settings-fields">
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
                    Esse controle muda o aviso no site. A abertura ou o
                    fechamento do Google Forms é feito no próprio formulário.
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
                <Button type="submit" disabled={busy}>
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
            </fieldset>
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
          if (!open && !busy && !uploading) {
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
            <form
              onSubmit={updateItem}
              className="editor-form"
              aria-busy={busy || uploading}
            >
              <fieldset
                disabled={busy || uploading}
                className="admin-editor-fields"
              >
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
                <Field
                  label={editing.type === 'member' ? 'Cargo' : 'Subtítulo'}
                >
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
                          setEditing({
                            ...editing,
                            description: e.target.value,
                          })
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
                  <small>
                    {uploading
                      ? 'Enviando imagem…'
                      : 'JPG, PNG ou WebP · até 5 MB.'}
                  </small>
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
                  <Button type="submit" disabled={busy || uploading}>
                    <Check size={16} />
                    {busy ? 'Salvando…' : 'Salvar conteúdo'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditing(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </fieldset>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open && !busy) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Excluir este conteúdo?</DialogTitle>
          <DialogDescription>
            {deleting?.title} será removido do site. Essa ação não pode ser
            desfeita.
          </DialogDescription>
          <div className="admin-form-actions">
            <Button
              disabled={busy}
              onClick={async () => {
                if (
                  deleting &&
                  (await persist({
                    ...data,
                    items: data.items.filter((i) => i.id !== deleting.id),
                  }))
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
    </div>
  );
}
