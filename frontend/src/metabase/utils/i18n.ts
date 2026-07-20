import dayjs from "dayjs";
import type { LocaleData } from "ttag";
import { addLocale, useLocale } from "ttag";

import { DAY_OF_WEEK_OPTIONS } from "metabase/utils/date-time";
import MetabaseSettings from "metabase/utils/settings";
import type { DayOfWeekId } from "metabase-types/api";

export type LocaleDataWithLanguage = LocaleData & {
  headers: { language?: string | null };
};

// Tell dayjs to use the value of the start-of-week Setting for its current locale
// range Sunday (0) - Saturday (6)
export function updateStartOfWeek(
  startOfWeekDayName: DayOfWeekId | null | undefined,
): void {
  const startOfWeekDay = getStartOfWeekDay(startOfWeekDayName);
  if (startOfWeekDay != null) {
    dayjs.updateLocale(dayjs.locale(), { weekStart: startOfWeekDay });
  }
}

// if the start of week Setting is updated, update the dayjs start of week
MetabaseSettings.on("start-of-week", updateStartOfWeek);

function setLanguage(translationsObject: LocaleDataWithLanguage): void {
  const locale = translationsObject.headers.language;
  if (!locale) {
    return;
  }

  addMsgIds(translationsObject);

  // add and set locale with ttag
  addLocale(locale, translationsObject);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLocale(locale);
}

const ARABIC_LOCALES = ["ar", "ar-sa"];
const RTL_LOCALES = ["ar", "ar-sa", "fa", "he"];
const BRAND_NAME_PATTERN = /\b(?:metabase|amara)\b/gi;
const BRANDING_SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT"]);

export function setLocalization(
  translationsObject: LocaleDataWithLanguage,
): void {
  const language = translationsObject.headers.language;
  if (!language) {
    return;
  }

  setLanguage(translationsObject);
  updateDocumentDirection(language);
  updateDayjsLocale(language);
  updateStartOfWeek(MetabaseSettings.get("start-of-week") as DayOfWeekId);

  if (ARABIC_LOCALES.includes(language)) {
    preserveLatinNumbersInDayjsLocale(language);
  }
}

function updateDocumentDirection(language: string): void {
  const locale = language.toLowerCase().replace("_", "-");
  const baseLocale = locale.split("-")[0];
  const direction =
    RTL_LOCALES.includes(locale) || RTL_LOCALES.includes(baseLocale)
      ? "rtl"
      : "ltr";

  document.documentElement.dir = direction;
  document.body.dir = direction;
  document.body.classList.toggle("mb-dir-rtl", direction === "rtl");
  document.body.classList.toggle("mb-dir-ltr", direction === "ltr");
}

function replaceBrandName(text: string | null): string | null {
  if (text == null) {
    return text;
  }

  return text.replace(BRAND_NAME_PATTERN, "AMARA");
}

function updateTextNodeBranding(node: Node): void {
  if (isBrandingSkippedNode(node)) {
    return;
  }

  const brandedText = replaceBrandName(node.nodeValue);
  if (brandedText !== node.nodeValue) {
    node.nodeValue = brandedText;
  }
}

function updateElementBranding(element: Element): void {
  if (isBrandingSkippedNode(element)) {
    return;
  }

  for (const attribute of ["aria-label", "title", "placeholder", "alt"]) {
    const value = element.getAttribute(attribute);
    const brandedValue = replaceBrandName(value);
    if (brandedValue !== value && brandedValue != null) {
      element.setAttribute(attribute, brandedValue);
    }
  }
}

function isBrandingSkippedNode(node: Node): boolean {
  if (node.nodeType === Node.ELEMENT_NODE) {
    return BRANDING_SKIP_TAGS.has((node as Element).tagName);
  }

  const parentElement = node.parentElement;
  return parentElement != null && BRANDING_SKIP_TAGS.has(parentElement.tagName);
}

function updateDocumentBranding(): void {
  document.title = replaceBrandName(document.title) ?? document.title;
  updateElementBranding(document.documentElement);
  updateElementBranding(document.body);

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) =>
        isBrandingSkippedNode(node)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    },
  );

  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      updateTextNodeBranding(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      updateElementBranding(node as Element);
    }
    node = walker.nextNode();
  }
}

function setupBrandingOverrides(): void {
  updateDocumentBranding();

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(updateDocumentBranding);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-label", "title", "placeholder", "alt"],
  });
}

/**
 * Ensures that we consistently use latin numbers in Arabic locales.
 * See https://github.com/metabase/metabase/issues/34271
 */
function preserveLatinNumbersInDayjsLocale(locale: string): void {
  dayjs.updateLocale(locale, {
    // Preserve latin numbers, but still replace commas.
    // See https://github.com/moment/moment/blob/000ac1800e620f770f4eb31b5ae908f6167b0ab2/locale/ar.js#L185
    postformat(string: string) {
      return string.replace(/,/g, "،");
    },
    meridiem: (hour: number) => {
      // https://github.com/iamkun/dayjs/pull/2717#issuecomment-2868626450
      return hour < 12 ? "ص" : "م";
    },
  });
}

function updateDayjsLocale(language: string): void {
  const locale = getLocale(language);

  try {
    if (locale !== "en") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- dynamic locale loading
      require(`dayjs/locale/${locale}.js`);
    }
    dayjs.locale(locale);
  } catch (e) {
    console.warn(`Could not set day.js locale to ${locale}`);
    dayjs.locale("en");
  }
}

function getLocale(language = ""): string {
  switch (language) {
    case "zh":
    case "zh-Hans":
      return "zh-cn";
    default:
      return language.toLowerCase();
  }
}

function getStartOfWeekDay(
  startOfWeekDayName: DayOfWeekId | null | undefined,
): number | undefined {
  if (!startOfWeekDayName) {
    return undefined;
  }

  const startOfWeekDayNumber = DAY_OF_WEEK_OPTIONS.findIndex(
    ({ id }) => id === startOfWeekDayName,
  );
  if (startOfWeekDayNumber === -1) {
    return undefined;
  }

  return startOfWeekDayNumber;
}

// we delete msgid property since it's redundant, but have to add it back in to
// make ttag happy
function addMsgIds(translationsObject: LocaleDataWithLanguage): void {
  const msgs = translationsObject.translations[""] as Record<
    string,
    { msgid?: string; msgstr: string[] }
  >;
  for (const msgid in msgs) {
    if (msgs[msgid].msgid === undefined) {
      msgs[msgid].msgid = msgid;
    }
  }
}

function hasLanguage(
  translationsObject?: LocaleDataWithLanguage,
): translationsObject is LocaleDataWithLanguage & {
  headers: { language: string };
} {
  return Boolean(translationsObject?.headers.language);
}

// Runs `f` with the current language for ttag set to the instance (site) locale rather than the user locale, then
// restores the user locale. This can be used for translating specific strings into the instance language; e.g. for
// parameter values in dashboard text cards that should be translated the same for all users viewing the dashboard.
export function withInstanceLanguage<T>(f: () => T): T {
  if (hasLanguage(window.MetabaseSiteLocalization)) {
    setLanguage(window.MetabaseSiteLocalization);
  }
  try {
    return f();
  } finally {
    if (hasLanguage(window.MetabaseUserLocalization)) {
      setLanguage(window.MetabaseUserLocalization);
    } else if (hasLanguage(window.MetabaseSiteLocalization)) {
      setLanguage(window.MetabaseSiteLocalization);
    }
  }
}

export function siteLocale(): string | undefined {
  if (hasLanguage(window.MetabaseSiteLocalization)) {
    return window.MetabaseSiteLocalization.headers.language;
  }
  return undefined;
}

// register site locale with ttag, if needed later
if (hasLanguage(window.MetabaseSiteLocalization)) {
  const translationsObject = window.MetabaseSiteLocalization;
  const locale = translationsObject.headers.language;
  addMsgIds(translationsObject);
  addLocale(locale, translationsObject);
}

// set the initial localization to user locale, falling back to the site locale
if (hasLanguage(window.MetabaseUserLocalization)) {
  setLocalization(window.MetabaseUserLocalization);
} else if (hasLanguage(window.MetabaseSiteLocalization)) {
  setLocalization(window.MetabaseSiteLocalization);
}

setupBrandingOverrides();
