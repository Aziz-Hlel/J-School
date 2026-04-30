export const isValidDate = (date: string) => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};
