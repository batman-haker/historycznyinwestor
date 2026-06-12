// Globalny ranking gry "Historyczny Inwestor"
// Czysty Node (bez zaleznosci). Nasluchuje TYLKO lokalnie (127.0.0.1) -
// na swiat wystawia go nginx pod /gra-api/.
//
// GET  /top    -> { single:[...], campaign:[...] }  (po 50 najlepszych)
// POST /score  -> { type:'single'|'campaign', name, epoch, capital, startCapital }

const http = require('http');
const fs = require('fs');
const path = require('path');

const FILE = process.env.SCORES_FILE || '/opt/gra-dane/scores.json';
const PORT = Number(process.env.PORT) || 41348;

function load() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
  catch (e) { return { single: [], campaign: [] }; }
}
function save(d) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(d));
}
// usun znaki HTML (ochrona przed wstrzykiwaniem w tabele rankingu)
function clean(s, max) {
  return String(s == null ? '' : s).replace(/[<>&"'`]/g, '').trim().slice(0, max);
}

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') { res.end(); return; }

  if (req.method === 'GET' && req.url.startsWith('/top')) {
    res.end(JSON.stringify(load()));
    return;
  }

  if (req.method === 'POST' && req.url.startsWith('/score')) {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 2000) req.destroy(); });
    req.on('end', () => {
      try {
        const s = JSON.parse(body);
        const type = s.type === 'campaign' ? 'campaign' : 'single';
        const entry = {
          name: clean(s.name, 24) || 'Gracz',
          epoch: clean(s.epoch, 48),
          capital: Math.round(Math.max(0, Math.min(10000000, Number(s.capital) || 0))),
          startCapital: Math.round(Math.max(1, Math.min(10000000, Number(s.startCapital) || 1000))),
          date: Date.now()
        };
        const d = load();
        d[type].push(entry);
        d[type].sort((a, b) => b.capital - a.capital);
        d[type] = d[type].slice(0, 50);
        save(d);
        res.end('{"ok":true}');
      } catch (e) {
        res.statusCode = 400;
        res.end('{"ok":false}');
      }
    });
    return;
  }

  res.statusCode = 404;
  res.end('{"error":"not found"}');
}).listen(PORT, '127.0.0.1', () => console.log('Ranking gry: http://127.0.0.1:' + PORT));
