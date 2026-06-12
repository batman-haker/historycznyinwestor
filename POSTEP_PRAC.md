# 📊 POSTĘP PRAC — Historyczny Inwestor

> Stan na: **2026-06-12** · gałąź `main` · ostatni commit: `dd9ef0f`

## 🎯 CEL PROJEKTU
Edukacyjna gra o historycznych kryzysach finansowych dla **zwykłego Kowalskiego**:
prosty polski język (zero żargonu traderskiego), realna trudność (łatwo przegrać,
trudno wygrać) i wyniki spójne z danymi rynkowymi widocznymi na ekranie.

---

## ✅ UKOŃCZONE (2026-06)

### 1. Język — 100% prosty polski 🇵🇱
Wszystkie **9 epok**: scenariusze, przyciski wyborów, komunikaty wyników
oraz cały system podpowiedzi („💡 Wskazówka", ~80 wpisów — wcześniej po angielsku).

Żargon tłumaczony opisowo przy pierwszym użyciu, np.:
- dźwignia → „inwestowanie za pożyczone pieniądze"
- stablecoin → „moneta, która ma zawsze być warta 1 dolara"
- subprime → „kredyty dla ludzi bez zdolności" (słowo-klucz zostawione celowo)
- short → „gra na spadek", margin call → „wezwanie do dopłaty depozytu"

### 2. Trudność — zero „pewniaków" 🎲
Diagnoza: gra była za łatwa, bo większość wyborów ZAWSZE dawała zysk
(np. COVID: 29/36 opcji bez ryzyka).

- Każda epoka poza 1930s ma teraz **0/36 wyborów bez ryzyka** — wszystko może zaboleć.
- Kuszące ruchy (all-in, łapanie dna, akcje memowe, krypto) = realny hazard.
- 1930s nietknięta (była dopracowana wcześniej).
- Mechanizm `DIFFICULTY` (mnożniki zysków/strat per epoka) — obecnie głównie 1.0,
  bo balans przeniesiono do widełek; lekkie mnożniki zostały w epokach środkowych.

### 3. Kotwice cenowe — wyniki liczone z prawdziwych cen 📈
**Najważniejsza zmiana mechaniki.** Problem: gracz kupił AMD przy rosnącej cenie
i tracił pieniądze, bo wynik był czystym losowaniem.

- `PRICE_ANCHORS`: ~138 decyzji w 8 epokach liczy wynik z **faktycznej zmiany ceny**
  w tabeli „Ceny na rynku" do następnego okresu (± szum ruchu 25%, ±3% pozycji,
  prowizja 1,5%, ruch przycięty do ±50%/decyzję).
- Tabela cen przestała być dekoracją — to **materiał do analizy przed decyzją**.
- Bez kotwicy (stare widełki) zostały: decyzje bez notowań (startupy, opcje, VC,
  czekanie), pułapki fabularne (np. „dip" na Lunie) i ostatnia runda każdej epoki.

### 4. Stawki proporcjonalne do kapitału 💰
Wyniki z widełek mnożone przez `kapitał/1000` (limit ×0,5–×4) — późne rundy
i tryb kampanii (kapitał przenosi się między epokami) mają sensowne stawki.

### 5. Spójność wyniku z wyświetlaniem 🎨
Kolor/ikona wyniku zawsze zgodne z wylosowaną kwotą (wcześniej strata
mogła świecić na zielono).

### 6. Grafika i UX ✨
- 🎬 **Wideo intro** w menu (Inwestor przemierza ulice NY) zamiast statycznego logo
- 🌊 Animowane fale (`faleintro.lottie`, odtwarzacz dotLottie) jako tło menu
- 🌌 Tło cząsteczkowe „fintech" (tsParticles) w całej grze
- 🔢 Animowany licznik kapitału (GSAP) + 🎉 konfetti przy zysku
- 📈/📉 Ikony Lottie wyniku (zielona/czerwona strzałka, wklejone inline)
- 🏆 Animacja `rajd.json` na ekranie końca epoki przy zysku
- 📒 Panel **„Historia decyzji"** — okres / wybór / zmiana $ / kapitał po
- 📊 Gradient pod wykresem kapitału (Chart.js)
- 🔤 Font **Inter** realnie wczytany (wcześniej tylko deklarowany)
- 🧹 Usunięty wstrzyknięty śmieciowy skrypt AdGuard

### 7. Dane rynkowe — audyt 🔍
Tablice `stockPrices` zweryfikowane: wiarygodne jako stylizowane przybliżenia.
Drobne znane nieścisłości: GE 1932 (zaniżony krach), Tesla COVID (miks cen
przed/po splicie 5:1).

---

## 🗂️ ARCHITEKTURA (gdzie co jest w `index.html`)
| Element | Obiekt / funkcja |
|---|---|
| Treść epok (scenariusze, ceny) | `const chapters` |
| Wyniki decyzji (widełki + opisy) | `const outcomes` w `calculateResult()` |
| Kotwice cenowe | `const PRICE_ANCHORS` + `anchoredResult()` |
| Trudność per epoka | `const DIFFICULTY` |
| Podpowiedzi 💡 | `const hints` |
| Rejestr decyzji | `history[]` + `renderLedger()` |
| Animacje wyniku | `window.GAME_LOTTIE_DATA` (inline w `<head>`) |

Hosting: `streamlit_app.py` wczytuje `index.html` (wszystkie zasoby z CDN/raw URL).

---

## ❌ DO ZROBIENIA / POMYSŁY
- [ ] Pełny test trybu kampanii (9 epok) po zmianach balansu
- [ ] Integracja ze stroną „Przegląd Świata"
- [ ] Kotwice cenowe dla 1930s (ostrożnie — epoka działa dobrze)
- [ ] Animacje w kolejce: `cel`, `dolarskacze`, `liczydlo`, `lotchmury`,
      `oszczedzanie` (2,6 MB — tylko przez raw URL, nie inline)
- [ ] Lottie wyniku „neutralnego" (teraz emoji ⚖️)
- [ ] Poprawka danych: GE 1932, Tesla split
- [ ] Ewentualnie: prawdziwy portfel (kupno X sztuk, trzymanie między rundami) —
      duża przebudowa, na razie świadomie odłożona

---

## 📝 NOTATKI TECHNICZNE
- Push wymaga `GIT_SSL_NO_VERIFY=true` (lokalny problem z certyfikatem).
- Edycja `index.html`: niektóre stringi mają niewidoczne różnice znaków —
  gdy podmiana tekstem zawodzi, działa node + `indexOf`/`slice`.
- Walidacja po każdej zmianie: wyciągnięcie bloków `<script>` → `node --check`.
