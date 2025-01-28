<script setup lang="ts">
interface Provider {
  name: string;
  description: string;
}

const providers: Provider[] = [
  {
    name: "HowLongToBeat",
    description:
      'Provides information to my "Currently Playing" and "Recently Completed" cards.',
  },
  {
    name: "Spotify",
    description: 'Provides information to my "Listening Now" card.',
  },
  {
    name: "RSS2JSON",
    description: 'Provides information to my "Recent Blog Post" card.',
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
          <p class="font-bold text-primary-foreground">{{ name }}</p>
          <p class="text-xs text-muted-foreground">
            {{ description }}
          </p>
        </li>
      </ul>
    </DialogContent>
  </Dialog>
</template>
