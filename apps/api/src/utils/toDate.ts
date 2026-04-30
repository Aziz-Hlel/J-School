export const toDate = (date: string | null): Date | null => {
  if (!date) return null;
  return new Date(date);
};

// * if you found a problem with the function above and got a case where you need to enforce just rename it to the name below and repalce them with each other
export const toDateOrNull = (date: string | null): Date | null => {
  if (!date) return null;
  return new Date(date);
};
