<script lang="ts" setup>
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useResumeDrawer } from "~/composables/use-resume-drawer";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const appConfig = useAppConfig();
const { open, openResumeDrawer } = useResumeDrawer();

const resumeUrl = computed(
  () => (appConfig.resumePdfUrl as string | undefined) ?? "/resume.pdf",
);

const isExternal = computed(() => {
  const url = resumeUrl.value;
  return url.startsWith("http://") || url.startsWith("https://");
});

/** Quiet Chrome PDF chrome; FitH keeps the page readable in a tall drawer. */
const previewSrc = computed(() => {
  const url = resumeUrl.value;
  if (isExternal.value) return url;
  const join = url.includes("#") ? "&" : "#";
  return `${url}${join}toolbar=0&navpanes=0&view=FitH`;
});

const clearResumeQuery = () => {
  if (!import.meta.client) return;
  if (route.query.resume == null) return;
  const query = { ...route.query };
  delete query.resume;
  router.replace({ query });
};

const openFromQuery = () => {
  const value = route.query.resume;
  if (value === "1" || value === "true") {
    openResumeDrawer();
    clearResumeQuery();
  }
};

watch(() => route.query.resume, openFromQuery, { immediate: true });

onMounted(openFromQuery);
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent
      side="right"
      :show-close="false"
      class="flex w-full flex-col gap-0 p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
    >
      <div
        class="flex shrink-0 items-center gap-3 border-b border-border/70 px-4 py-3 sm:px-5"
      >
        <SheetHeader class="min-w-0 flex-1 space-y-0 p-0 text-left">
          <SheetTitle class="truncate text-base font-medium tracking-tight">
            {{ t("nav.resume") }}
          </SheetTitle>
          <SheetDescription class="sr-only">
            {{ t("common.resumePreview") }}
          </SheetDescription>
        </SheetHeader>

        <div class="flex shrink-0 items-center gap-1">
          <Button
            as="a"
            :href="resumeUrl"
            :download="!isExternal ? 'resume.pdf' : undefined"
            :target="isExternal ? '_blank' : undefined"
            :rel="isExternal ? 'noopener noreferrer' : undefined"
            size="sm"
            class="gap-1.5 shadow-none"
          >
            <Icon name="ph:download-simple" :size="16" />
            {{ t("common.downloadCv") }}
          </Button>
          <SheetClose
            class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Icon name="ph:x" :size="18" />
            <span class="sr-only">{{ t("common.close") }}</span>
          </SheetClose>
        </div>
      </div>

      <div class="relative min-h-0 flex-1 bg-background">
        <object
          v-if="open"
          :data="previewSrc"
          type="application/pdf"
          class="absolute inset-0 h-full w-full"
          :aria-label="t('nav.resume')"
        >
          <div
            class="flex h-full min-h-[50dvh] flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground"
          >
            <p>{{ t("common.resumeUnavailable") }}</p>
            <Button
              as="a"
              :href="resumeUrl"
              :download="!isExternal ? 'resume.pdf' : undefined"
              :target="isExternal ? '_blank' : undefined"
              :rel="isExternal ? 'noopener noreferrer' : undefined"
              size="sm"
              class="gap-1.5 shadow-none"
            >
              <Icon name="ph:download-simple" :size="16" />
              {{ t("common.downloadCv") }}
            </Button>
          </div>
        </object>
      </div>
    </SheetContent>
  </Sheet>
</template>
