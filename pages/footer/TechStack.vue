<script setup lang="ts">
import { techStack } from "~/constants";
</script>

<template>
  <TooltipProvider>
    <div class="flex items-center gap-2">
      <template v-for="{ url, name, icon } in techStack" :key="name">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              :href="url"
              target="_blank"
              class="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon :name="icon" class="w-5 h-5" />
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
