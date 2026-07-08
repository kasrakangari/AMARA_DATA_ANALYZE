// eslint-disable-next-line no-restricted-imports
import { Global, css } from "@emotion/react";
import { useMemo } from "react";

import { useSetting } from "metabase/common/hooks";
import { baseStyle, rootStyle } from "metabase/css/core/base.styled";
import { defaultFontFiles } from "metabase/css/core/fonts.styled";
import {
  isPublicEmbedding,
  isStaticEmbedding,
} from "metabase/embedding/config";
import { useSelector } from "metabase/redux";
import { getMetabaseCssVariables } from "metabase/styled-components/theme/css-variables";
import { useMantineTheme } from "metabase/ui";
import { getSitePath } from "metabase/utils/dom";
import { getFontFamilyValue } from "metabase/utils/fonts";
import { saveDomImageStyles } from "metabase/visualizations/lib/image-exports";

import { getFont, getFontFiles } from "../../selectors";

export const GlobalStyles = (): JSX.Element => {
  const font = useSelector(getFont);
  const fontFiles = useSelector(getFontFiles);
  const whitelabelColors = useSetting("application-colors");

  const sitePath = getSitePath();
  const theme = useMantineTheme();
  const { colorScheme } = theme.other;

  // This can get expensive so we should memoize it separately
  const cssVariables = useMemo(() => {
    return getMetabaseCssVariables({ theme, whitelabelColors });
  }, [theme, whitelabelColors]);

  const styles = useMemo(() => {
    return css`
      ${cssVariables}
      :root {
        --mb-default-font-family: ${getFontFamilyValue(font)};
      }

      ${defaultFontFiles({ baseUrl: sitePath })}
      ${fontFiles?.map(
        (file) => css`
          @font-face {
            font-family: "Custom";
            src: url(${encodeURI(file.src)}) format("${file.fontFormat}");
            font-weight: ${file.fontWeight};
            font-style: normal;
            font-display: swap;
          }
        `,
      )}
    ${saveDomImageStyles}
      body {
        font-size: 0.875em;
        ${isStaticEmbedding() || isPublicEmbedding()
          ? ""
          : `color-scheme: ${colorScheme};`}
        ${rootStyle}
      }

      body.mb-wrapper.mb-dir-rtl {
        direction: rtl;
      }

      body.mb-wrapper.mb-dir-ltr {
        direction: ltr;
      }

      .mb-wrapper.mb-dir-rtl input:not([type]),
      .mb-wrapper.mb-dir-rtl input[type="text"],
      .mb-wrapper.mb-dir-rtl input[type="search"],
      .mb-wrapper.mb-dir-rtl textarea,
      .mb-wrapper.mb-dir-rtl [contenteditable="true"] {
        unicode-bidi: plaintext;
        text-align: start;
      }

      .mb-wrapper.mb-dir-rtl h1,
      .mb-wrapper.mb-dir-rtl h2,
      .mb-wrapper.mb-dir-rtl h3,
      .mb-wrapper.mb-dir-rtl h4,
      .mb-wrapper.mb-dir-rtl h5,
      .mb-wrapper.mb-dir-rtl h6,
      .mb-wrapper.mb-dir-rtl p,
      .mb-wrapper.mb-dir-rtl label,
      .mb-wrapper.mb-dir-rtl button,
      .mb-wrapper.mb-dir-rtl a,
      .mb-wrapper.mb-dir-rtl li,
      .mb-wrapper.mb-dir-rtl th,
      .mb-wrapper.mb-dir-rtl td {
        unicode-bidi: plaintext;
      }

      .mb-wrapper.mb-dir-rtl .react-grid-layout,
      .mb-wrapper.mb-dir-rtl .react-grid-item,
      .mb-wrapper.mb-dir-rtl [class*="DashboardGridContainer"],
      .mb-wrapper.mb-dir-rtl [class*="DashCard"],
      .mb-wrapper.mb-dir-rtl [class*="Visualization"],
      .mb-wrapper.mb-dir-rtl [class*="Table"],
      .mb-wrapper.mb-dir-rtl [class*="DataGrid"],
      .mb-wrapper.mb-dir-rtl [role="grid"],
      .mb-wrapper.mb-dir-rtl [role="table"],
      .mb-wrapper.mb-dir-rtl table {
        direction: ltr;
      }

      .mb-wrapper.mb-dir-rtl .react-grid-item h1,
      .mb-wrapper.mb-dir-rtl .react-grid-item h2,
      .mb-wrapper.mb-dir-rtl .react-grid-item h3,
      .mb-wrapper.mb-dir-rtl .react-grid-item h4,
      .mb-wrapper.mb-dir-rtl .react-grid-item h5,
      .mb-wrapper.mb-dir-rtl .react-grid-item h6,
      .mb-wrapper.mb-dir-rtl .react-grid-item p,
      .mb-wrapper.mb-dir-rtl .react-grid-item label,
      .mb-wrapper.mb-dir-rtl .react-grid-item button,
      .mb-wrapper.mb-dir-rtl .react-grid-item a,
      .mb-wrapper.mb-dir-rtl .react-grid-item li,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] h1,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] h2,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] h3,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] h4,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] h5,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] h6,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] p,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] label,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] button,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] a,
      .mb-wrapper.mb-dir-rtl [class*="Visualization"] li,
      .mb-wrapper.mb-dir-rtl [class*="Table"] th,
      .mb-wrapper.mb-dir-rtl [class*="Table"] td,
      .mb-wrapper.mb-dir-rtl [class*="DataGrid"] [role="columnheader"],
      .mb-wrapper.mb-dir-rtl [class*="DataGrid"] [role="cell"],
      .mb-wrapper.mb-dir-rtl [role="grid"] [role="columnheader"],
      .mb-wrapper.mb-dir-rtl [role="grid"] [role="cell"],
      .mb-wrapper.mb-dir-rtl table th,
      .mb-wrapper.mb-dir-rtl table td {
        unicode-bidi: plaintext;
      }

      .mb-wrapper.mb-dir-rtl input[type="email"],
      .mb-wrapper.mb-dir-rtl input[type="url"],
      .mb-wrapper.mb-dir-rtl input[type="password"],
      .mb-wrapper.mb-dir-rtl input[type="number"],
      .mb-wrapper.mb-dir-rtl input[type="tel"],
      .mb-wrapper.mb-dir-rtl input[name*="email" i],
      .mb-wrapper.mb-dir-rtl input[name*="url" i],
      .mb-wrapper.mb-dir-rtl input[name*="password" i],
      .mb-wrapper.mb-dir-rtl input[autocomplete="email"],
      .mb-wrapper.mb-dir-rtl input[autocomplete="username"],
      .mb-wrapper.mb-dir-rtl input[autocomplete="current-password"],
      .mb-wrapper.mb-dir-rtl input[autocomplete="new-password"],
      .mb-wrapper.mb-dir-rtl code,
      .mb-wrapper.mb-dir-rtl kbd,
      .mb-wrapper.mb-dir-rtl samp,
      .mb-wrapper.mb-dir-rtl pre,
      .mb-wrapper.mb-dir-rtl .cm-editor,
      .mb-wrapper.mb-dir-rtl .ace_editor,
      .mb-wrapper.mb-dir-rtl [data-testid*="sql" i],
      .mb-wrapper.mb-dir-rtl [data-testid*="url" i],
      .mb-wrapper.mb-dir-rtl [data-testid*="email" i] {
        direction: ltr;
        text-align: left;
        unicode-bidi: isolate;
      }

      ${baseStyle}
    `;
  }, [cssVariables, font, sitePath, fontFiles, colorScheme]);

  return <Global styles={styles} />;
};
