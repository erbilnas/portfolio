<script setup lang="ts">
import { technologies } from "~/constants/footer";
</script>

<template>
  <TooltipProvider>
    <div class="flex items-center gap-2">
      <template v-for="{ url, name, icon } in technologies" :key="name">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              :href="url"
              target="_blank"
              class="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon :name="icon" class="w-4 h-4" />
            </a>
          </TooltipTrigger>

          <TooltipContent>
            <p>{{ name }}</p>
          </TooltipContent>
        </Tooltip>
      </template>
    </div>
  </TooltipProvider>
</template>
