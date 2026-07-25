import { messages, type Locale, type Messages } from "./messages";

type LeafPaths<T, P extends string = ""> = T extends string
  ? P
  : {
      [K in keyof T & string]: LeafPaths<
        T[K],
        P extends "" ? K : `${P}.${K}`
      >;
    }[keyof T & string];

export type MessageKey = LeafPaths<Messages>;

function lookup(dict: Messages, key: string): string | undefined {
  const parts = key.split(".");
  let cur: unknown = dict;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  let text =
    lookup(messages[locale], key) ?? lookup(messages.ko, key) ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}
