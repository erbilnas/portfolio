export const usePageMeta = () => {
  const setTitle = (section: string) => {
    useHead({
      titleTemplate: `${section} | Erbil Nas`,
    });
  };

  return {
    setTitle,
  };
};
