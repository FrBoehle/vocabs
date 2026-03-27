export function addDays(date: Date, days: number): Date {
  const cloned = new Date(date);
  cloned.setDate(cloned.getDate() + days);
  return cloned;
}

export function isBeforeOrEqualToday(dateString: string): boolean {
  const value = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return value.getTime() <= today.getTime();
}
