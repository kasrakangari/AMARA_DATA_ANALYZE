# Amara Data Analyze

Amara Data Analyze is a Persian/Farsi-focused analytics platform based on the open-source Metabase project.

This fork is customized for Persian-speaking teams who want a business intelligence tool with a familiar interface, Amara branding, Persian translations, and right-to-left layout support.

> Farsi-first, RTL-ready, and built for Persian-speaking data teams.

![Amara Logo](resources/frontend_client/app/assets/img/amara-logo.png)

## What Is Amara?

Amara helps teams explore data, build dashboards, ask questions, and understand business performance without needing every user to write SQL.

This repository keeps the strong analytics foundation of Metabase, but adapts the product experience for Persian users.

## Amara Customizations

- Persian/Farsi localization work in `locales/fa.po`.
- Right-to-left layout support for Persian UI mode.
- Left-to-right handling for English text, SQL, code, numbers, and data tables so mixed Persian/English content stays readable.
- Amara branding in visible product text.
- Custom Amara logo replacing the default Metabase logo.
- Removed Metabase help/tips areas that did not fit the Amara experience.
- Persian sample content and UI wording improvements.
- Fixes for loading UTF-8 Persian translations correctly on Windows.

## Main Translation File

The main Persian translation file is:

```text
locales/fa.po
```

After changing translations, rebuild the i18n resources:

```powershell
clojure -X:build:build/i18n
```

## Amara Logo

The Amara logo asset is stored at:

```text
resources/frontend_client/app/assets/img/amara-logo.png
```

The main frontend logo component is:

```text
frontend/src/metabase/common/components/LogoIcon/LogoIcon.tsx
```

## Local Development

From the repository root, start the frontend dev server:

```powershell
$env:MB_FRONTEND_DEV_PORT="9000"
bun run build-hot
```

Start the backend server:

```powershell
$env:MB_FRONTEND_DEV_PORT="9000"
clojure -M:run:dev:dev-start --hot
```

Then open:

```text
http://localhost:3000/
```

## Persian/RTL Notes

Amara should use RTL layout when Persian is selected, while English words, SQL, table values, paths, numbers, and technical labels remain readable in LTR direction where needed.

Relevant frontend files include:

```text
frontend/src/metabase/utils/i18n.ts
frontend/src/metabase/styled-components/containers/GlobalStyles/GlobalStyles.tsx
frontend/src/metabase/redux/context.tsx
```

## Project Status

This is an active customization fork. The Persian translation and UI polish are still being improved.

Recommended next steps:

- Continue translating `locales/fa.po`.
- Review important user flows in Persian.
- Improve dashboard and table behavior in RTL layouts.
- Replace remaining product wording with Amara-specific wording where appropriate.
- Add Persian documentation for admins and end users.

## License

See:

```text
LICENSE.txt
LICENSE-AGPL.txt
LICENSE-MCL.txt
LICENSE-EMBEDDING.txt
```
