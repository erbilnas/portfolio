<script setup lang="ts">
import Copyright from "./Copyright.vue";
import Providers from "./Providers.vue";
import UsedTechnologies from "./UsedTechnologies.vue";

import Version from "./Version.vue";
</script>

<template>
  <section id="footer">
    <div
      class="flex flex-col py-32 items-center gap-4 p-4 bg-white dark:bg-gradient-to-b dark:from-zinc-950 dark:to-slate-950"
    >
      <UsedTechnologies />

      <div class="text-center space-y-2">
        <div class="flex flex-row items-center gap-2">
          <Version />

          <Separator orientation="vertical" class="h-4" />

          <Providers />
        </div>

        <Copyright />
      </div>
    </div>
  </section>
</template>
