export const useOpenUrl = (url: string, type = "_blank") => {
  return window.open(url, type);
};
