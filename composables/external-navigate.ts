export const useExternalNavigate = () => {
  const navigateTo = (url: string) => {
    window.open(url, "_blank");
  };

  return { navigateTo };
};
