import styleData from '../data/styles.json';

const FALLBACK_IDS = {
  palette: 'slate_modern',
  font: 'inter',
  layout: 'sidebar_nav',
};

function byId(collection, id, fallbackId) {
  if (id) {
    const found = collection.find((item) => item.id === id);
    if (found) return found;
  }
  return collection.find((item) => item.id === fallbackId) || collection[0];
}

export function buildStyleConfig(selectedStyle) {
  const palette = byId(styleData.palettes, selectedStyle?.palette?.id, FALLBACK_IDS.palette);
  const font = byId(styleData.fonts, selectedStyle?.font?.id, FALLBACK_IDS.font);
  const layout = byId(styleData.layouts, selectedStyle?.layout?.id, FALLBACK_IDS.layout);

  return {
    styleConfig: {
      colorPalette: { ...palette.colorPalette },
      typography: { ...font.typography },
      layout: { ...layout.layout },
      meta: {
        darkMode: Boolean(palette.darkMode),
        animationsEnabled: Boolean(styleData.meta?.animationsEnabled),
        version: Number(styleData.meta?.version || 1),
      },
    },
  };
}
