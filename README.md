# Jany-Latyn

[Kyrgyzça (Jany-Latyn)](docs/README.ky-jany.md) · [Кыргызча (Кириллица)](docs/README.ky.md) · [Русский](docs/README.ru.md) · English · [Türkçe](docs/README.tr.md)

**Jany-Latyn** is a Latin orthography for Kyrgyz (Кыргызча) that can be derived from Cyrillic. It comes with
a deterministic conversion engine and a web testbed in which every contested orthographic choice
is a selectable option.

The core mappings are **ж→j, ч→ç, ш→ş, х→h, ң→ŋ, ө→ö, ү→ü, ы→y, й→í**, plus doubled long vowels
(тоок → took). Russian signs `ъ`/`ь` are absorbed, so every word is purely alphabetic.

> Ак мөңгүлүү аска, зоолор, талаалар → **Ak möŋgülüü aska, zoolor, talaalar**

The full argument for these choices, and the places where it could be wrong, is in the whitepaper:
**[docs/WHITEPAPER.md](docs/WHITEPAPER.md)**. The mapping rules are in [docs/SPEC.md](docs/SPEC.md).

## Repository layout

| Path | What it is | License |
| :--- | :--- | :--- |
| [`packages/engine/`](packages/engine) | Converter, CLI, keyboard layouts, tests, conformance checker | MIT |
| [`apps/web/`](apps/web) | Testbed web application (SvelteKit) | PolyForm Noncommercial 1.0.0 |
| [`docs/`](docs) | Whitepaper, specification, keyboard guide, translated READMEs | CC BY 4.0 |

## Install and use the engine

The engine is pure TypeScript with no runtime dependencies. Node.js 20 or newer is required.

```sh
git clone https://github.com/qylymcom/jany-latyn.git
cd jany-latyn
npm install
npm run build

echo "Ак мөңгүлүү аска" | node packages/engine/dist/src/cli.js                 # Ak möŋgülüü aska
echo "Ак мөңгүлүү аска" | node packages/engine/dist/src/cli.js --to fallback   # ASCII: Ak monguluu aska
echo "Ak möŋgülüü aska" | node packages/engine/dist/src/cli.js --to cyrillic   # Ак мөңгүлүү аска
```

From code:

```ts
import { cyrToJany, janyToCyr, janyToFallback } from 'jany-latyn/convert';

cyrToJany('Ак мөңгүлүү аска'); // 'Ak möŋgülüü aska'
```

Keyboard layouts for macOS and Linux are in `packages/engine/keymaps/`. Setup instructions are in
[docs/keyboard.md](docs/keyboard.md).

## Run the testbed locally

```sh
npm install
npm run dev          # http://localhost:5173
npm run build:web    # static build in apps/web/build/
```

No configuration is needed. `apps/web/.env.example` lists the optional settings. Analytics are
**off** unless `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` are both set, so a local, self-hosted, or
classroom copy sends no events anywhere.

## Run the tests

```sh
npm test             # engine suite, codepoint inventory, package boundary, and whitepaper conformance checker
npm run check:web    # Svelte and TypeScript diagnostics for the web app
```

The conformance checker verifies the transliteration examples in `docs/WHITEPAPER.md` against the
engine, so the whitepaper and the engine are versioned together.

## License: licensed in three parts

This repository has no single license. The engine is **MIT**, the web testbed is **PolyForm
Noncommercial 1.0.0**, and the documents are **CC BY 4.0**. Each directory carries its own `LICENSE`.
See **[LICENSING.md](LICENSING.md)** for what this means in practice. The project name and logo are
covered by [TRADEMARK.md](TRADEMARK.md), and how to contribute is in [CONTRIBUTING.md](CONTRIBUTING.md).

## Citing this work

If you use the software or the specification, please cite it. Metadata is in
[CITATION.cff](CITATION.cff), and GitHub's "Cite this repository" button reads from that file. The whitepaper
front matter also includes a citation line.
