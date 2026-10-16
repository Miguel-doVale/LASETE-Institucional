import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('public/images', { recursive: true });
const sources = {
  logo: 'src/images/495615039_17846064768472435_5135636324272577005_n.jpg',
  'luiz-felipe': '/tmp/codex-clipboard-AtzOP5.png',
  'pedro-brasil': '/tmp/codex-clipboard-E3PkXk.png',
  'joao-garcia': '/tmp/codex-clipboard-DpBfsu.png',
  'marcos-vinicius': '/tmp/codex-clipboard-aYtwzj.png',
  'luis-castro': '/tmp/codex-clipboard-GAK266.png',
  luiza: '/tmp/codex-clipboard-7nqNrc.png',
  gheorghe: '/tmp/codex-clipboard-bbVTJJ.png',
  'rodrigo-justino': '/tmp/codex-clipboard-Y3ygxb.png',
  'rodrigo-almeida': '/tmp/codex-clipboard-oJ8r4c.png',
  comunidade: '/tmp/codex-clipboard-pGZxaN.png',
  'web-hacking': '/tmp/codex-clipboard-EGDUKI.png',
  ctic: '/tmp/codex-clipboard-EuQDDi.png',
  'machine-learning': '/tmp/codex-clipboard-g0694O.png',
  giro: '/tmp/codex-clipboard-krFPjq.png',
  privacidade: '/tmp/codex-clipboard-rlTPSf.png',
  'ctf-registro': '/tmp/codex-clipboard-cJcQ4b.png',
  'sobre-liga': '/tmp/codex-clipboard-eMVrUA.png',
};
for (const [name, source] of Object.entries(sources)) {
  await sharp(source)
    .rotate()
    .resize({
      width: name === 'comunidade' ? 1600 : name === 'logo' ? 600 : 1000,
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(`public/images/${name}.webp`);
}
console.log(`Preparados ${Object.keys(sources).length} assets locais.`);
