# Creative coding & clown computing

Slides de la xerrada de **Joan Leon** i **Dani Herrera**, en nom de l'associació
[Geeks.cat](https://geeks.cat/), a [La Girotrònica 2026](https://lagirotronica.cat/)
(Palau Firal de Girona, del 20 al 22 de novembre de 2026).

> Creative Coding és un tipus de programació on l'objectiu és generar experiències
> expressives en comptes de productes funcionals. Usarem la tecnologia per parlar de
> programació, fer difusió d'accessibilitat i de tecnologia responsable i, alhora,
> fer participar els assistents de l'experiència del creative coding.

Fetes amb [Reveal.js](https://revealjs.com/) i empaquetades amb Vite: la presentació
no necessita cap CDN ni connexió per funcionar (les demos enllaçades, sí).

## Executar en local

Cal Node.js 22.12 o superior.

```sh
npm ci
npm run dev
```

Obre l'adreça que surt al terminal.

| Fitxer          | Què hi ha                                              |
| --------------- | ------------------------------------------------------ |
| `index.html`    | Les slides                                             |
| `src/style.css` | L'estil (colors de La Girotrònica)                     |
| `src/chaos.js`  | El fons animat de la portada (canvia-hi `CHAOS`)       |
| `src/main.js`   | Configuració de Reveal i peu de pàgina comú            |
| `assets/`       | Logos i imatges                                        |

Tecles útils: Espai per avançar per totes les slides en ordre, fletxes per moure's
entre blocs (dreta/esquerra) i dins d'un bloc (avall/amunt), `Esc` per veure-les
totes i `F` per a pantalla completa.

## Publicar

```sh
npm run build
npm run preview
```

El workflow [pages.yml](.github/workflows/pages.yml) compila i publica a GitHub Pages
a cada `push` a `main`. Cal activar-ho un sol cop a **Settings → Pages → Source →
GitHub Actions**. L'adreça serà <https://ctrl-alt-d.github.io/Girotronica2026Geeks/>.

## Crèdits

- El logo de La Girotrònica és propietat dels seus organitzadors (Esports Electrònics
  de Girona) i el de Geeks.cat, de l'associació Geeks.cat. S'usen aquí només per
  identificar l'esdeveniment i l'entitat.
- El codi de la presentació té llicència [MIT](LICENSE).
