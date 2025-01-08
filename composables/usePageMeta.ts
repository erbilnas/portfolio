export const usePageMeta = () => {
  const updateTitle = (section: string) => {
    useHead({
      titleTemplate: `${section} | Erbil Nas`,
    });
  };

  return {
    updateTitle,
  };
};
