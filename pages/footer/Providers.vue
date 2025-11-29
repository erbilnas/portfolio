<script setup lang="ts">
interface Provider {
  name: string;
  description: string;
}

const providers: Provider[] = [
  {
    name: "HowLongToBeat",
    description: "Provides data for my video games section.",
  },
  {
    name: "Spotify",
    description: "Provides data for my music section.",
  },
  {
    name: "RSS2JSON",
    description: "Provides data for my blog section.",
  },
];
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="link"
        class="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Providers
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
