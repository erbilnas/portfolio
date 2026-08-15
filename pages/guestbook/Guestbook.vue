<script setup lang="ts">
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
      class="flex min-h-screen flex-col items-center bg-white px-6 py-20 dark:bg-black md:px-10 md:py-24"
    >
      <div class="w-full max-w-5xl text-center">
        <h2
          class="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-7xl"
        >
          {{ t("guestbook.title") }}
        </h2>
        <p
          class="mx-auto mt-4 max-w-xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400 md:text-xl"
        >
          {{ t("guestbook.description") }}
        </p>
      </div>

      <div
        class="mt-14 grid w-full max-w-5xl gap-12 md:mt-16 md:grid-cols-2 md:items-start md:gap-16"
      >
        <div class="min-w-0">
          <p
            class="text-sm font-medium text-neutral-800 dark:text-neutral-200"
          >
            {{ t("guestbook.notes") }}
          </p>
          <ul v-if="entries.length" class="mt-6 flex flex-col gap-8">
            <li v-for="entry in entries" :key="entry.id" class="min-w-0">
              <p
                class="text-base font-light leading-relaxed text-neutral-800 dark:text-neutral-200"
              >
                {{ entry.note }}
              </p>
              <p
                class="mt-2 text-sm text-neutral-500 dark:text-neutral-400"
              >
                {{ entry.name }}
                <span class="tabular-nums">
                  · {{ formatDate(entry.createdAt) }}
                </span>
              </p>
            </li>
          </ul>
          <p
            v-else
            class="mt-6 text-sm font-light text-neutral-500 dark:text-neutral-400"
          >
            {{ t("guestbook.empty") }}
          </p>
        </div>

        <form
          class="flex min-w-0 flex-col gap-4 rounded-2xl bg-neutral-50 px-5 py-6 dark:bg-white/[0.04] md:px-6 md:py-7"
          @submit.prevent="onSubmit"
        >
          <p class="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {{ t("guestbook.sign") }}
          </p>
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs text-neutral-500 dark:text-neutral-400"
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
              class="w-full rounded-lg bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-1 ring-neutral-200/80 placeholder:text-neutral-400 focus-visible:ring-neutral-400 dark:bg-neutral-950 dark:text-white dark:ring-white/10 dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-500"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs text-neutral-500 dark:text-neutral-400"
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
              class="w-full resize-none rounded-lg bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-1 ring-neutral-200/80 placeholder:text-neutral-400 focus-visible:ring-neutral-400 dark:bg-neutral-950 dark:text-white dark:ring-white/10 dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-500"
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
          <button
            type="submit"
            :disabled="pending"
            class="mt-1 self-start rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-950 disabled:opacity-60"
          >
            {{ t("guestbook.submit") }}
          </button>
          <p
            v-if="messageKey"
            class="text-xs text-neutral-500 dark:text-neutral-400"
            role="status"
          >
            {{ t(`guestbook.${messageKey}`) }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
