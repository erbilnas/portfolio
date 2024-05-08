export const useOpenUrl = (url: string, type = "_blank") => {
  return window.open(url, type);
};

export const useResize = (maxWidth: number) => {
  const isMobile = ref(false);

  const resize = () => {
    isMobile.value = window.innerWidth < maxWidth;
  };

  onMounted(() => {
    resize();

    window.addEventListener("resize", resize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resize);
  });

  return isMobile;
};
