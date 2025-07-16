export const isProviderCodeValid = (code: string): boolean => {
  if (!code || typeof code !== "string") {
    return false;
  }

  const pattern = /^[0-9]{6}$/;
  return pattern.test(code);
};
