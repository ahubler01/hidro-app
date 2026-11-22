# Hidro · Make your Moeve

Clickable concept of Hidro, a loyalty companion for the Moeve gow app.

Live: https://ahubler01.github.io/hidro-app/

| Page | What it is |
|---|---|
| `index.html` | The phone app: QR, pay, earn, the Plaza, moves, customise. You pay as you always do; there is nothing to tick. |
| `station.html` | The station's big screen (16:9). Two counters on top, neighbours on three terraces. Click to let a visitor land. |
| `car.html` | The car-screen widget. Click to see Hidro fade and wake up. |
| `film.html` | The full stop: phone, till, station screen, phone. Plays by itself. |
| `scenes.html?scene=` | Short scenes: `today`, `meet`, `spin`, `reveal`, `closing`. |

Shared code: `js/hidro.js` (mascot and movements), `js/data.js` (points, factors, content), `js/plaza.js` (the scene), `js/privacy.js` (rules for public numbers).

## Rules of the concept

- Everything members earn today stays. Greener moves count double.
- Litres keep their cashback and never make Hidro shine.
- Your exact numbers stay on your phone.
- Public numbers are national, 30-day rolling, rounded, delayed and shown at a constant speed, so nobody can work back to one person or to one station's demand. See `js/privacy.js`.

All figures are illustrative estimates. No build step: open `index.html` or serve the folder.

Student concept for the IE University Moeve Challenge (Group 7). Not affiliated with or endorsed by Moeve.
