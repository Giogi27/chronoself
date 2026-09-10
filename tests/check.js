const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const files=fs.readdirSync('.',{recursive:true}).filter(f=>!f.startsWith('.git/')&&!f.startsWith('node_modules/')&&!f.startsWith('test-results/')&&fs.statSync(f).isFile());
for(const file of files.filter(f=>/\.(js|cjs)$/.test(f))) execFileSync(process.execPath,['--check',file]);
for(const file of files.filter(f=>f.endsWith('.html'))) {
  const html=fs.readFileSync(file,'utf8');
  for(const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:[^"\s]*)"/g)) {
    if(/^(https?:|#)/.test(match[1]))continue;
    const target=match[1].startsWith('/')?match[1].slice(1):path.join(path.dirname(file),match[1]);
    if(!fs.existsSync(target))throw new Error(file+': missing '+target);
  }
}
for(const file of ['manifest.json','vercel.json','package.json'])JSON.parse(fs.readFileSync(file,'utf8'));
console.log('Syntax, local HTML references and JSON: passed ('+files.length+' files inspected).');
