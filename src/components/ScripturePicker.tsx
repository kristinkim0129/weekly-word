"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/context/LocaleProvider";
import {
  searchMemoryVerses,
  type MemoryVerse,
} from "@/lib/memory-verses";

type Props = {
  chapter: string;
  passage: string;
  onChange: (next: { chapter: string; passage: string }) => void;
};

/** Optional helper: pick a catalog verse to fill Chapter + Passage. */
export function ScripturePicker({ chapter, passage, onChange }: Props) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => searchMemoryVerses(query, 10), [query]);

  function selectVerse(verse: MemoryVerse) {
    onChange({ chapter: verse.reference, passage: verse.text });
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="scripture-picker">
      <button
        type="button"
        className="segment-btn"
        style={{ width: "100%" }}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? t("capture.scriptureHelperHide") : t("capture.scripturePick")}
      </button>

      {open ? (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("capture.scriptureSearchPh")}
            aria-label={t("capture.scriptureSearchPh")}
            style={{ marginTop: 8 }}
          />
          {chapter || passage ? (
            <div className="scripture-selected">
              {chapter ? (
                <p className="word-verse-sm" style={{ margin: "0 0 4px" }}>
                  {chapter}
                </p>
              ) : null}
              {passage ? (
                <p className="hint" style={{ margin: 0 }}>
                  {passage}
                </p>
              ) : null}
            </div>
          ) : null}
          <ul className="scripture-results" role="listbox">
            {results.map((v) => {
              const selected = chapter === v.reference;
              return (
                <li key={v.reference}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`scripture-result ${selected ? "selected" : ""}`}
                    onClick={() => selectVerse(v)}
                  >
                    <strong>{v.reference}</strong>
                    <span>{v.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="tiny" style={{ margin: "6px 0 0" }}>
            {t("capture.scriptureSource")}
          </p>
        </>
      ) : null}
    </div>
  );
}
