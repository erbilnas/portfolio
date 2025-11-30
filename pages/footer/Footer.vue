<script setup lang="ts">
import Copyright from "./Copyright.vue";
import Providers from "./Providers.vue";
import UsedTechnologies from "./UsedTechnologies.vue";

import Version from "./Version.vue";
</script>

<template>
  <section id="footer">
    <div
      class="flex flex-col py-36 items-center gap-6 px-6 bg-white dark:bg-black"
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
