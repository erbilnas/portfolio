<script setup lang="ts">
import { technologies } from "~/constants/footer";
</script>

<template>
  <TooltipProvider>
    <ul
      class="flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-3 list-none"
      role="list"
    >
      <li v-for="{ url, name, icon } in technologies" :key="name">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Visit ${name} (opens in new tab)`"
              class="flex size-8 items-center justify-center text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-gray-400 dark:hover:text-white"
            >
              <Icon :name="icon" class="size-4" />
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
