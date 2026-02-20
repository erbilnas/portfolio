<script lang="ts" setup>
const appConfig = useAppConfig();

const resumeUrl = computed(
  () => (appConfig.resumePdfUrl as string | undefined) ?? "/resume.pdf",
);

useSeoMeta({
  title: "Resume - Erbil Nas",
  description:
    "Download or view Erbil Nas's resume and professional experience.",
  ogTitle: "Resume - Erbil Nas",
  ogDescription:
    "Download or view Erbil Nas's resume and professional experience.",
  twitterTitle: "Resume - Erbil Nas",
  twitterDescription:
    "Download or view Erbil Nas's resume and professional experience.",
});

definePageMeta({
  layout: "print",
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div
      class="no-print flex items-center justify-between gap-4 p-6 border-b border-gray-200 dark:border-gray-800"
    >
      <NuxtLink
        to="/"
        class="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {{ $t("common.goBack") }}
      </NuxtLink>
      <DownloadCvButton />
    </div>

    <div class="flex-1 flex flex-col p-4 md:p-6">
      <object
        :data="resumeUrl"
        type="application/pdf"
        class="w-full flex-1 min-h-[calc(100vh-8rem)] rounded-lg border border-gray-200 dark:border-gray-800 print:border-0 print:min-h-screen"
        aria-label="Resume PDF"
      >
        <div
          class="flex flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground"
        >
          <p>{{ $t("common.error") }}</p>
          <DownloadCvButton />
        </div>
      </object>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }

  object {
    width: 100% !important;
    min-height: 100vh !important;
    border: none !important;
  }
}
</style>
