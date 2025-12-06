export const isFourPartName = (name) => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return parts.length === 4;
};
