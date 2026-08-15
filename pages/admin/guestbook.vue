<script setup lang="ts">
interface AdminGuestbookEntry {
  id: string;
  name: string;
  note: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const { t } = useI18n();
const { data, refresh } = await useFetch<{ entries: AdminGuestbookEntry[] }>(
  "/api/admin/guestbook",
);

const entries = computed(() => data.value?.entries ?? []);
const busyId = ref("");

useSeoMeta({
  robots: "noindex, nofollow",
  title: "Admin · Guestbook",
});

async function setStatus(id: string, action: "approve" | "reject") {
  busyId.value = id;
  try {
    await $fetch(`/api/admin/guestbook/${id}`, {
      method: "PATCH",
      body: { action },
    });
    await refresh();
  } finally {
    busyId.value = "";
  }
}

async function remove(id: string) {
  busyId.value = id;
  try {
    await $fetch(`/api/admin/guestbook/${id}`, { method: "DELETE" });
    await refresh();
  } finally {
    busyId.value = "";
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-3xl font-semibold tracking-tight">
        {{ t("admin.modules.guestbook") }}
      </h1>
      <p class="mt-2 text-sm font-light text-neutral-500 dark:text-neutral-400">
        {{ t("admin.guestbook.lead") }}
      </p>
    </div>

    <p
      v-if="!entries.length"
      class="text-sm text-neutral-500 dark:text-neutral-400"
    >
      {{ t("admin.guestbook.empty") }}
    </p>

    <ul v-else class="flex flex-col gap-8">
      <li
        v-for="entry in entries"
        :key="entry.id"
        class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-10"
      >
        <div class="min-w-0">
          <p class="text-base font-light leading-relaxed">
            {{ entry.note }}
          </p>
          <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span class="font-medium text-neutral-800 dark:text-neutral-200">
              {{ t(`admin.guestbook.status.${entry.status}`) }}
            </span>
            · {{ entry.name }}
            <span class="tabular-nums"> · {{ formatDate(entry.createdAt) }}</span>
          </p>
        </div>
        <div class="flex shrink-0 flex-wrap gap-x-4 gap-y-2 text-sm">
          <button
            v-if="entry.status !== 'approved'"
            type="button"
            class="font-medium text-neutral-800 hover:text-neutral-950 disabled:opacity-50 dark:text-neutral-200 dark:hover:text-white"
            :disabled="busyId === entry.id"
            @click="setStatus(entry.id, 'approve')"
          >
            {{ t("admin.guestbook.approve") }}
          </button>
          <button
            v-if="entry.status !== 'rejected'"
            type="button"
            class="font-medium text-neutral-800 hover:text-neutral-950 disabled:opacity-50 dark:text-neutral-200 dark:hover:text-white"
            :disabled="busyId === entry.id"
            @click="setStatus(entry.id, 'reject')"
          >
            {{ t("admin.guestbook.reject") }}
          </button>
          <button
            type="button"
            class="text-neutral-500 hover:text-neutral-800 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-neutral-200"
            :disabled="busyId === entry.id"
            @click="remove(entry.id)"
          >
            {{ t("admin.guestbook.delete") }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
