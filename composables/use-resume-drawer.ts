export const useResumeDrawer = () => {
  const open = useState("resume-drawer-open", () => false);

  const openResumeDrawer = () => {
    open.value = true;
  };

  const closeResumeDrawer = () => {
    open.value = false;
  };

  return {
    open,
    openResumeDrawer,
    closeResumeDrawer,
  };
};
