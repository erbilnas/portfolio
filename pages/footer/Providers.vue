<script setup lang="ts">
import { providers } from "~/constants";
</script>

<template>
  <HoverCard>
    <HoverCardTrigger asChild>
      <Button variant="link" class="text-xs text-white/50"> Providers </Button>
    </HoverCardTrigger>

    <HoverCardContent>
      <ul class="flex flex-col gap-4 text-sm">
        <li
          v-for="provider in providers"
          :key="provider.name"
          class="flex flex-col gap-1"
        >
          <p class="font-bold text-primary">{{ provider.name }}</p>
          <p class="text-xs text-white/60">
            {{ provider.description }}
          </p>
        </li>
      </ul>
    </HoverCardContent>
  </HoverCard>
</template>
