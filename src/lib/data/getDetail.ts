export function getMoreDetailed(num: number) {
  const p2Value = Number(num.toPrecision(2));
  const precision2 = p2Value.toString();

  const fixed1 = num.toFixed(1);

  const getDecimalPlaces = (str: string) => {
    if (str.includes('e')) return 0;
    const parts = str.split('.');
    return parts.length > 1 ? parts[1].length : 0;
  };

  if (getDecimalPlaces(precision2) >= getDecimalPlaces(fixed1)) {
    return p2Value.toLocaleString();
  } else {
    return Number(fixed1).toLocaleString();
  }
}
