<script setup lang="ts">
import Copyright from "./Copyright.vue"
import Providers from "./Providers.vue"
import TechStack from "./TechStack.vue"

import Version from "./Version.vue"
</script>

<template>
  <section id="footer">
    <div
      class="flex flex-col py-32 items-center gap-4 p-4 bg-gradient-to-b from-zinc-950 to-slate-950"
    >
      <TechStack />

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
