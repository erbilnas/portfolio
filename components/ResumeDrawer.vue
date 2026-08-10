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
import { X } from "lucide-vue-next";
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
      <SheetHeader
        class="flex-row items-center justify-between gap-3 space-y-0 border-b border-border px-4 py-3 text-left sm:px-6"
      >
        <div class="min-w-0 space-y-0.5">
          <SheetTitle>{{ t("nav.resume") }}</SheetTitle>
          <SheetDescription class="sr-only">
            {{ t("common.showResume") }}
          </SheetDescription>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <Button
            as="a"
            :href="resumeUrl"
            :download="!isExternal ? 'resume.pdf' : undefined"
            :target="isExternal ? '_blank' : undefined"
            :rel="isExternal ? 'noopener noreferrer' : undefined"
            variant="outline"
            size="sm"
            class="gap-2"
          >
            <Icon name="ph:file-pdf" :size="16" />
            {{ t("common.downloadCv") }}
          </Button>
          <SheetClose
            class="inline-flex size-8 items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </SheetClose>
        </div>
      </SheetHeader>

      <div class="min-h-0 flex-1 bg-muted/30 p-3 sm:p-4">
        <object
          v-if="open"
          :data="resumeUrl"
          type="application/pdf"
          class="h-full min-h-[70vh] w-full rounded-md border border-border bg-background"
          aria-label="Resume PDF"
        >
          <div
            class="flex h-full min-h-[70vh] flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground"
          >
            <p>{{ t("common.error") }}</p>
            <Button
              as="a"
              :href="resumeUrl"
              :download="!isExternal ? 'resume.pdf' : undefined"
              :target="isExternal ? '_blank' : undefined"
              :rel="isExternal ? 'noopener noreferrer' : undefined"
              variant="outline"
              class="gap-2"
            >
              <Icon name="ph:file-pdf" :size="16" />
              {{ t("common.downloadCv") }}
            </Button>
          </div>
        </object>
      </div>
    </SheetContent>
  </Sheet>
</template>
