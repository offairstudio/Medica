# Medica brand assets

Downloaded from the official hospital websites on 2026-08-26.

- `medica-logo.svg` — https://www.medica.co.il/wp-content/uploads/2019/11/logo_medica_color.svg
- `medica-elisha-logo.png` — https://www.elishahospital.com/wp-content/uploads/2020/11/logo-01.png
- `medica-rmc-logo.png` — https://rmc-med.co.il/wp-content/uploads/2021/04/new-logo2.png
- `medica-raphael-logo.png` — https://www.raphaelhospitals.co.il/Content/images/logo.png

The product uses local copies so navigation and hospital identification do not depend on third-party uptime.

- `medica-auth-hero-v1.png` — original image generated for this product with the built-in OpenAI image-generation tool. Prompt: premium abstract medical architecture, translucent H-inspired forms, official Medica purple/lavender/turquoise palette, no text or logos.

## Official brand vectors (2026-09-13)

Converted from the client's brand book (`ספר מותג/לוגואים`) with `pdftocairo -svg`, cropped to the
artwork's bounding box:

- `medica-logo-wide.svg` — "מדיקה-כללי לוגו רוחבי א" (mark, wordmark and slogan).
- `medica-mark.svg` — the medica symbol, taken from the same file (replaces the version that was
  downloaded from the website).
- `centres/<centre>-wide.svg` — each centre's horizontal logo, for places with room to read it.
  `centres/elisha-wide.png` is the brand book's own PNG: Elisha has no Hebrew horizontal vector.
- `centres/<centre>-name.svg` — the centre-name line out of the Hebrew logo. In Hebrew the centre
  name sits in a small secondary line under "medica", so this line is what identifies the centre at
  chip size.
- `centres/<centre>-en.svg` — the English horizontal lockup ("medica | Tel Aviv"), a single line
  that stays readable at chip size, so in English the chip carries the whole logo.

The centre artwork is drawn as a CSS mask (see `CentreArt.tsx`), which is what lets the same
single-colour vector appear in white on the centre's colour.
