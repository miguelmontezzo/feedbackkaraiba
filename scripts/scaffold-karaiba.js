#!/usr/bin/env node
/*
  Script de scaffold para copiar templates Karaíba para um destino.
  Uso:
    node scripts/scaffold-karaiba.js /caminho/do/novo/projeto
*/
import fs from 'fs';
import path from 'path';

const [, , destArg] = process.argv;
if (!destArg) {
  console.error('Uso: node scripts/scaffold-karaiba.js /caminho/do/novo/projeto');
  process.exit(1);
}

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srcTemplateDir = path.join(projectRoot, 'src', 'template');
const dest = path.resolve(destArg);

if (!fs.existsSync(srcTemplateDir)) {
  console.error('Diretório de template não encontrado:', srcTemplateDir);
  process.exit(1);
}

fs.mkdirSync(path.join(dest, 'src', 'template'), { recursive: true });

const files = fs.readdirSync(srcTemplateDir);
for (const file of files) {
  const from = path.join(srcTemplateDir, file);
  const to = path.join(dest, 'src', 'template', file);
  fs.copyFileSync(from, to);
  console.log('Copiado', file, 'para', to);
}

console.log('\n✔ Templates Karaíba copiados para', path.join(dest, 'src', 'template'));
console.log('Importe e use em seu App, por exemplo:');
console.log("  import KaraibaLayout from '@/template/Layout'");
console.log("  import KaraibaKanban from '@/template/Kanban'");
console.log('  ...');
