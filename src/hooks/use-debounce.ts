export const useDebounce = (delay: number) => {
  let timeout: NodeJS.Timeout | null = null;

  return (func: () => void) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(func, delay);
  };
};
