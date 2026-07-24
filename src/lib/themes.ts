export type ThemeId = "blush" | "mint" | "sky" | "peach" | "lilac";

export type Theme = {
  id: ThemeId;
  name: string;
  nameKo: string;
  swatch: string;
};

export const THEMES: Theme[] = [
  { id: "blush", name: "Blush", nameKo: "블러시", swatch: "#F4C4D0" },
  { id: "mint", name: "Mint", nameKo: "민트", swatch: "#B8E0D2" },
  { id: "sky", name: "Sky", nameKo: "스카이", swatch: "#B8D4F0" },
  { id: "peach", name: "Peach", nameKo: "피치", swatch: "#F5C9A8" },
  { id: "lilac", name: "Lilac", nameKo: "라일락", swatch: "#D4C4F0" },
];

export const DEFAULT_THEME: ThemeId = "mint";
