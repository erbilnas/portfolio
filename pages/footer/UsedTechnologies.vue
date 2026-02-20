<script setup lang="ts">
import { technologies } from "~/constants/footer";
</script>

<template>
  <TooltipProvider>
    <ul class="flex items-center gap-2 list-none" role="list">
      <li v-for="{ url, name, icon } in technologies" :key="name">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Visit ${name} (opens in new tab)`"
              class="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Icon :name="icon" class="w-4 h-4" />
            </a>
          </TooltipTrigger>

          <TooltipContent>
            <p>{{ name }}</p>
          </TooltipContent>
        </Tooltip>
      </li>
    </ul>
  </TooltipProvider>
</template>
