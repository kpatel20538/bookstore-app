export function formatPrice (price) {
  const centsPerDollar = 100;
  return `$${price / centsPerDollar}`;
};
