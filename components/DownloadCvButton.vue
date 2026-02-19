<script lang="ts" setup>
const route = useRoute();
const appConfig = useAppConfig();

const resumeUrl = computed(
  () => (appConfig.resumePdfUrl as string | undefined) ?? "/resume.pdf",
);

const isExternal = computed(() => {
  const url = resumeUrl.value;
  return url.startsWith("http://") || url.startsWith("https://");
});

const isResumePage = computed(() => route.path === "/resume");
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <ShimmerButton v-if="!isResumePage" @click="navigateTo('/resume')">
      <Icon name="ph:read-cv-logo" :size="20" />
      {{ $t("common.showResume") }}
    </ShimmerButton>
    <Button
      v-if="isResumePage"
      as="a"
      :href="resumeUrl"
      :download="!isExternal ? 'resume.pdf' : undefined"
      :target="isExternal ? '_blank' : undefined"
      :rel="isExternal ? 'noopener noreferrer' : undefined"
      variant="outline"
      size="lg"
      class="gap-2"
    >
      <Icon name="ph:file-pdf" :size="20" />
      {{ $t("common.downloadCv") }}
    </Button>
  </div>
</template>
