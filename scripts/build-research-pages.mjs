import { readFile, writeFile, mkdir } from 'node:fs/promises';
const categories = JSON.parse(await readFile(new URL('../src/data/research.json', import.meta.url), 'utf8'));
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
for (const category of categories) {
  const directory = new URL(`../dist/research/${category.slug}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  const title = `${category.title} Research | Axis11`.replaceAll('&', '&amp;');
  await writeFile(new URL('index.html', directory), html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`));
}
