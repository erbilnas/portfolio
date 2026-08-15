<script setup lang="ts">
definePageMeta({
  layout: false,
});

const route = useRoute();
const { t } = useI18n();

useSeoMeta({
  robots: "noindex, nofollow",
  title: "Admin",
});

const { data: status } = await useFetch<{
  configured: boolean;
  missing: string[];
}>("/api/admin/auth/status");

try {
  const meHeaders = import.meta.server
    ? useRequestHeaders(["cookie"])
    : undefined;
  await $fetch("/api/admin/me", { headers: meHeaders });
  await navigateTo("/admin/guestbook");
} catch {
  // stay on login
}

const missing = computed(() => status.value?.missing ?? []);
const configured = computed(() => Boolean(status.value?.configured));

const errorKey = computed(() => {
  const raw = route.query.error;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "forbidden" || value === "oauth" || value === "state") {
    return value;
  }
  return "";
});
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-black"
  >
    <div class="flex max-w-sm flex-col items-center gap-6 text-center">
      <h1 class="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
        {{ t("admin.title") }}
      </h1>
      <p class="text-sm font-light text-neutral-500 dark:text-neutral-400">
        {{ t("admin.loginHint") }}
      </p>
      <p
        v-if="errorKey"
        class="text-sm text-neutral-700 dark:text-neutral-300"
        role="alert"
      >
        {{ t(`admin.errors.${errorKey}`) }}
      </p>
      <div
        v-if="missing.length"
        class="w-full text-left text-sm text-neutral-600 dark:text-neutral-300"
        role="status"
      >
        <p>{{ t("admin.errors.missing") }}</p>
        <ul class="mt-2 list-disc pl-5 font-mono text-xs">
          <li v-for="key in missing" :key="key">{{ key }}</li>
        </ul>
      </div>
      <a
        v-if="configured"
        href="/api/admin/auth/github"
        class="rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-950"
      >
        {{ t("admin.continueGithub") }}
      </a>
    </div>
  </div>
</template>
