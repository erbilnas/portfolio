<script setup lang="ts">
import { Button } from "@/components/ui/button";

const { t, locale } = useI18n();

interface GuestbookNote {
  id: string;
  name: string;
  note: string;
  createdAt: string;
}

const sectionRef = ref<HTMLElement | null>(null);
useObserver("Guestbook", sectionRef);

const { data, refresh } = useFetch<{ entries: GuestbookNote[] }>(
  "/api/guestbook",
);

const name = ref("");
const note = ref("");
const website = ref("");
const pending = ref(false);
const messageKey = ref<"pending" | "error" | "rateLimited" | "">("");

const entries = computed(() => data.value?.entries ?? []);

function formatDate(value: string) {
  const localeMap: Record<string, string> = {
    tr: "tr-TR",
    ja: "ja-JP",
    en: "en-US",
  };
  return new Date(value).toLocaleDateString(localeMap[locale.value] || "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function onSubmit() {
  pending.value = true;
  messageKey.value = "";
  try {
    const result = await $fetch<{ status?: string; message?: string }>(
      "/api/guestbook",
      {
        method: "POST",
        body: {
          name: name.value,
          note: note.value,
          website: website.value,
        },
      },
    );
    if (result?.status === "pending") {
      messageKey.value = "pending";
      name.value = "";
      note.value = "";
      await refresh();
    }
  } catch (error: unknown) {
    const status =
      error && typeof error === "object" && "statusCode" in error
        ? Number((error as { statusCode?: number }).statusCode)
        : 0;
    messageKey.value = status === 429 ? "rateLimited" : "error";
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <section id="guestbook" ref="sectionRef" class="relative">
    <div
      class="flex flex-col items-center bg-white px-6 py-24 dark:bg-black md:px-10 md:py-32"
    >
      <div class="w-full max-w-5xl text-center">
        <h2
          class="text-balance text-5xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-7xl"
        >
          {{ t("guestbook.title") }}
        </h2>
        <p
          class="mx-auto mt-3 max-w-md text-pretty text-base font-light leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg"
        >
          {{ t("guestbook.description") }}
        </p>
      </div>

      <div
        class="mt-12 grid w-full max-w-5xl gap-10 md:mt-16 md:grid-cols-2 md:items-start md:gap-16"
      >
        <form
          class="flex min-w-0 flex-col gap-4"
          @submit.prevent="onSubmit"
        >
          <div class="flex flex-col gap-1.5">
            <label
              class="text-sm text-neutral-600 dark:text-neutral-400"
              for="guestbook-name"
            >
              {{ t("guestbook.name") }}
            </label>
            <input
              id="guestbook-name"
              v-model="name"
              type="text"
              maxlength="40"
              autocomplete="nickname"
              required
              class="w-full rounded-md bg-transparent px-3 py-2.5 text-sm text-neutral-900 outline-none ring-1 ring-neutral-200/90 placeholder:text-neutral-400 focus-visible:ring-neutral-400 dark:text-white dark:ring-white/15 dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-500"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label
              class="text-sm text-neutral-600 dark:text-neutral-400"
              for="guestbook-note"
            >
              {{ t("guestbook.note") }}
            </label>
            <textarea
              id="guestbook-note"
              v-model="note"
              maxlength="120"
              required
              rows="4"
              class="w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-sm text-neutral-900 outline-none ring-1 ring-neutral-200/90 placeholder:text-neutral-400 focus-visible:ring-neutral-400 dark:text-white dark:ring-white/15 dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-500"
            />
          </div>
          <div class="hidden" aria-hidden="true">
            <input
              v-model="website"
              type="text"
              tabindex="-1"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-wrap items-center gap-3 pt-1">
            <Button type="submit" size="sm" :disabled="pending" class="shadow-none">
              {{ t("guestbook.submit") }}
            </Button>
            <p
              v-if="messageKey"
              class="text-xs text-neutral-500 dark:text-neutral-400"
              role="status"
            >
              {{ t(`guestbook.${messageKey}`) }}
            </p>
          </div>
        </form>

        <div class="min-w-0">
          <p
            class="text-sm font-medium text-neutral-800 dark:text-neutral-200"
          >
            {{ t("guestbook.notes") }}
            <span
              v-if="entries.length"
              class="ml-1.5 tabular-nums font-normal text-neutral-400 dark:text-neutral-500"
            >
              {{ entries.length }}
            </span>
          </p>

          <ul
            v-if="entries.length"
            class="mt-5 flex flex-col gap-6"
          >
            <li v-for="entry in entries" :key="entry.id" class="min-w-0">
              <p
                class="text-pretty text-base font-light leading-relaxed text-neutral-800 dark:text-neutral-200"
              >
                {{ entry.note }}
              </p>
              <p class="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                {{ entry.name }}
                <span class="tabular-nums">
                  · {{ formatDate(entry.createdAt) }}
                </span>
              </p>
            </li>
          </ul>
          <p
            v-else
            class="mt-5 text-sm font-light leading-relaxed text-neutral-500 dark:text-neutral-400"
          >
            {{ t("guestbook.empty") }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
