<script setup lang="ts">
const { t } = useI18n();

interface Provider {
  name: string;
  description: string;
}

const providers = computed<Provider[]>(() => [
  {
    name: t("footer.providers.howLongToBeat.name"),
    description: t("footer.providers.howLongToBeat.description"),
  },
  {
    name: t("footer.providers.spotify.name"),
    description: t("footer.providers.spotify.description"),
  },
  {
    name: t("footer.providers.rss2json.name"),
    description: t("footer.providers.rss2json.description"),
  },
]);
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="link"
        class="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {{ $t("footer.providers.title") }}
      </Button>
    </DialogTrigger>

    <DialogContent>
      <ul class="flex flex-col gap-4 text-sm">
        <li
          v-for="{ name, description } in providers"
          :key="name"
          class="flex flex-col gap-1"
        >
          <p class="font-bold text-gray-900 dark:text-white">{{ name }}</p>
          <p class="text-xs text-muted-foreground">
            {{ description }}
          </p>
        </li>
      </ul>
    </DialogContent>
  </Dialog>
</template>
