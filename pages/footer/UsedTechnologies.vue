<script setup lang="ts">
import { technologies } from "~/constants/footer";
</script>

<template>
  <TooltipProvider>
    <ul
      class="flex max-w-2xl flex-wrap items-center justify-center gap-x-3.5 gap-y-2.5"
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
              class="flex size-9 items-center justify-center text-neutral-500 transition-colors duration-150 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-500 dark:hover:text-white"
            >
              <Icon :name="icon" class="size-[1.125rem]" />
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
