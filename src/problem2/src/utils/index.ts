// utils.ts
export const parseNumber = (str: string) => {
  const clean = str.replace(/,/g, "");
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
};

export const formatNumber = (num: number) =>
  num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

