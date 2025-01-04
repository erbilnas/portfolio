<script lang="ts" setup>
const { maps } = useAppConfig();

const props = defineProps<{
  isActive?: boolean;
}>();
</script>

<template>
  <div class="flex flex-col gap-2 items-center">
    <GlareCard>
      <div class="absolute inset-0">
        <NuxtImg
          class="size-full object-cover"
          src="/images/map-card-bg.jpg"
          quality="100"
        />
      </div>

      <div
        class="relative z-10 p-8 text-white bg-black/50 backdrop-blur-sm h-full"
      >
        <div class="space-y-4">
          <div class="space-y-1">
            <h3 class="text-l font-semibold">Custom Map</h3>
            <h2 class="text-2xl font-bold">The Hitchhiker's Guide</h2>
          </div>

          <div class="space-y-2 flex flex-col gap-4">
            <p class="text-sm text-white/80">Veni, vidi, vici!</p>
            <iframe
              :src="maps.placesBeen"
              class="w-full md:h-[300px] rounded-sm"
            ></iframe>
          </div>
        </div>
      </div>
    </GlareCard>

    <InteractiveHoverButton
      v-show="isActive"
      class="w-48 text-center"
      text="View Map"
      @click="navigateTo(maps.placesBeen)"
    />
  </div>
</template>

<style scoped></style>
