import { onMounted, onUnmounted, watch, type Ref } from "vue";
import { sectionMeta } from "~/seo/sections";

const DEFAULT_TITLE = "Erbil Nas";
const DEFAULT_DESCRIPTION =
  "Welcome to my personal website. I am a Software Engineer passionate about creating innovative solutions and sharing knowledge.";

/** Middle viewport band so only one section owns the tab title at a time. */
const observerOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: "-35% 0px -45% 0px",
  threshold: 0,
};

export const useSectionSeo = () => {
  const title = useState("section-seo-title", () => DEFAULT_TITLE);
  const description = useState(
    "section-seo-description",
    () => DEFAULT_DESCRIPTION,
  );

  return { title, description };
};

export const useObserver = (section: string, elRef: Ref<HTMLElement | null>) => {
  const meta = sectionMeta[section];
  if (!meta) return;

  const { title, description } = useSectionSeo();

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      title.value = meta.title;
      if (meta.description) {
        description.value = meta.description;
      }
    }
  };

  let observer: IntersectionObserver | null = null;
  let stopWatcher: (() => void) | null = null;

  onMounted(() => {
    const setupObserver = () => {
      if (!elRef.value || observer) return;
      observer = new IntersectionObserver(handleIntersection, observerOptions);
      observer.observe(elRef.value);
    };

    setupObserver();

    stopWatcher = watch(
      () => elRef.value,
      () => {
        setupObserver();
      },
      { immediate: true },
    );
  });

  onUnmounted(() => {
    stopWatcher?.();
    if (observer) {
      if (elRef.value) observer.unobserve(elRef.value);
      observer.disconnect();
      observer = null;
    }
  });
};
