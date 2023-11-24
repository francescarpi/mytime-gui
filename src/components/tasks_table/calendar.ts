export function useCalendar() {
  const dateLimits = (date: string) => {
    const today = new Date();
    return (
      date <=
      `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
    );
  };
  return {
    dateLimits,
  };
}
