# LASETE Institucional

Prévia do frontend em React, TypeScript, Vite e Tailwind. Sete páginas públicas; hero WebGL/ASCII; painel editorial local em `/admin`.

## Desenvolvimento

```sh
npm install
npm run dev
# http://localhost:5180 (porta separada do SEMISPE)
```

## Verificação

```sh
npm run build
npm run test:e2e
```

## Deploy na Vercel

Use o preset **Vite**, o comando de build `npm run build` e o diretório de saída `dist`.
O `vercel.json` na raiz encaminha acessos diretos e atualizações de rotas como `/admin`
e `/membros` para o React Router. Endereços desconhecidos exibem o 404 da LASETE.
Depois de enviar essa configuração ao repositório conectado, faça um novo deploy para
aplicar a correção; repetir um deploy antigo não inclui arquivos locais novos.

## Prévia editorial

`/admin` fica fora da navegação pública. Esta entrega não contém autenticação ou autorização reais: o painel é uma demonstração visual com dados salvos no localStorage do navegador. Não publicar o painel como área administrativa de produção. A integração com Supabase Auth, Database e Storage está prevista para a próxima etapa; qualquer administrador autorizado poderá publicar diretamente. O fluxo não depende de serviço externo nesta prévia.

As mudanças no seletivo controlam o aviso do site; não abrem ou fecham o Google Forms. Os links de edital e formulário foram fornecidos pelo responsável. As fotos e nomes vêm dos materiais fornecidos. Pesquisa e mídia não recebem entradas fictícias.

`PRODUCT.md` registra os fatos e decisões aprovados; `DESIGN.md` registra a direção visual. Os arquivos originais em `src/images` foram preservados.
