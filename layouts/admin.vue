<script setup lang="ts">
import { adminModules } from "~/constants/admin-modules";

const { t } = useI18n();
const route = useRoute();
const { data: me } = await useFetch<{ login: string }>("/api/admin/me", {
  headers: import.meta.server ? useRequestHeaders(["cookie"]) : undefined,
});

useSeoMeta({
  robots: "noindex, nofollow",
  title: "Admin",
});

async function logout() {
  await $fetch("/api/admin/auth/logout", { method: "POST" });
  await navigateTo("/admin/login");
}
</script>

<template>
  <div
    class="min-h-screen bg-white text-neutral-950 dark:bg-black dark:text-white"
  >
    <div class="mx-auto flex min-h-screen max-w-6xl">
      <aside
        class="hidden w-52 shrink-0 flex-col justify-between py-10 pr-8 md:flex"
      >
        <nav class="flex flex-col gap-2">
          <p class="mb-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {{ t("admin.title") }}
          </p>
          <NuxtLink
            v-for="mod in adminModules"
            :key="mod.id"
            :to="mod.path"
            class="text-sm"
            :class="
              route.path === mod.path
                ? 'font-semibold text-neutral-950 dark:text-white'
                : 'font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
            "
          >
            {{ t(mod.labelKey) }}
          </NuxtLink>
        </nav>
        <div class="flex flex-col gap-2 text-sm">
          <p class="text-neutral-500 dark:text-neutral-400">
            {{ me?.login }}
          </p>
          <button
            type="button"
            class="self-start text-left text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
            @click="logout"
          >
            {{ t("admin.logout") }}
          </button>
        </div>
      </aside>
      <main class="min-w-0 flex-1 px-6 py-10 md:px-0">
        <div class="mb-8 flex items-center justify-between md:hidden">
          <p class="text-sm font-medium">{{ t("admin.title") }}</p>
          <button
            type="button"
            class="text-sm text-neutral-600 dark:text-neutral-300"
            @click="logout"
          >
            {{ t("admin.logout") }}
          </button>
        </div>
        <slot />
      </main>
    </div>
  </div>
</template>
