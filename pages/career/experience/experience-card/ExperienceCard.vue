<script setup lang="ts">
import type { WorkExperience } from "~/types/career";
import Description from "./Description.vue";
import Positions from "./Positions.vue";
import Summary from "./Summary.vue";
import Technologies from "./Technologies.vue";

interface Props {
  experience: WorkExperience;
}

const props = defineProps<Props>();
</script>

<template>
  <div>
    <CardContent class="p-6">
      <CardItem class="flex flex-col gap-1 sm:gap-2 md:gap-4">
        <div
          class="flex items-start gap-1 sm:gap-2 pb-2 border-b border-slate-800/50"
        >
          <Summary
            :currentPosition="experience.currentPosition"
            :company="experience.company"
            :location="experience.location"
            :period="experience.period"
          />
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <Positions :positions="experience.positions" />

          <Description :description="experience.description" />

          <Technologies :technologies="experience.technologies" />
        </div>
      </CardItem>
    </CardContent>
  </div>
</template>
