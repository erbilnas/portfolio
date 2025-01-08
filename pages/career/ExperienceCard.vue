<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface WorkExperience {
  company: string;
  position: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
  icon?: string;
  positions?: {
    title: string;
    duration: string;
  }[];
}

interface Props {
  experience: WorkExperience;
  isActive: boolean;
  isMobile: boolean;
  style: {
    transform: string;
    opacity: number;
    zIndex: number;
    filter: string;
    transition: string;
  };
}

const props = defineProps<Props>();
const isHovered = ref(false);

// Add subtle floating animation
const floatingOffset = ref(0);
const startFloatingAnimation = () => {
  const animate = () => {
    floatingOffset.value = Math.sin(Date.now() / 1000) * 5;
    requestAnimationFrame(animate);
  };
  animate();
};

onMounted(() => {
  startFloatingAnimation();
});
</script>

<template>
  <CardContainer
    class="absolute experience-card"
    :style="[
      style,
      {
        transform: `${style.transform} translateY(${
          isHovered && isActive ? floatingOffset : 0
        }px)`,
      },
    ]"
    :aria-hidden="!isActive"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <Card
      v-if="isActive || !props.isMobile"
      class="w-full bg-gradient-to-br from-slate-950 to-slate-900 backdrop-blur-sm hover:shadow-glow transition-all duration-300 border border-slate-800/50 overflow-hidden"
      :class="{
        'h-[500px] sm:h-[400px] md:h-[450px]': isActive,
        'h-[100px] sm:h-[120px]': !isActive,
        'w-full': isActive,
        'hidden sm:block': !isActive,
      }"
      :tabindex="isActive ? 0 : -1"
    >
      <!-- Preview mode for inactive cards on mobile -->
      <div
        v-if="!isActive"
        class="h-full p-2 sm:p-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-1 sm:gap-2">
          <div
            class="p-1 sm:p-1.5 rounded-lg bg-primary/5 text-primary shrink-0 border border-primary/10"
          >
            <Icon
              v-if="experience.icon"
              :name="experience.icon"
              class="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 animate-glow"
              :aria-label="experience.company + ' icon'"
            />
          </div>
          <div>
            <h3 class="font-semibold text-violet-400">
              {{ experience.position }}
            </h3>
            <p class="text-sm text-slate-400">{{ experience.company }}</p>
          </div>
        </div>
        <Icon name="heroicons:chevron-right" class="w-5 h-5 text-slate-400" />
      </div>

      <!-- Full content for active cards -->
      <CardContent
        v-else
        class="h-full p-2 sm:p-4 md:p-6 overflow-y-auto custom-scrollbar"
      >
        <CardItem
          class="flex flex-col h-full gap-1 sm:gap-2 md:gap-4"
          :translateZ="20"
        >
          <!-- Top section with icon and company info -->
          <div
            class="flex items-start gap-1 sm:gap-2 pb-2 border-b border-slate-800/50"
          >
            <CardItem
              class="p-1 sm:p-2 rounded-lg bg-primary/5 text-primary shrink-0 group-hover:bg-primary/10 transition-colors border border-primary/10"
              :translateZ="40"
            >
              <Icon
                v-if="experience.icon"
                :name="experience.icon"
                class="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 animate-glow"
                :aria-label="experience.company + ' icon'"
              />
            </CardItem>
            <CardItem class="space-y-1 md:space-y-2" :translateZ="30">
              <h3
                class="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-violet-600"
              >
                {{ experience.position }}
              </h3>
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-slate-400"
              >
                <span>{{ experience.company }}</span>
                <span class="hidden sm:inline text-slate-600">•</span>
                <span>{{ experience.location }}</span>
              </div>
              <div class="text-sm text-violet-400">
                {{ experience.period }}
              </div>
            </CardItem>
          </div>

          <!-- Bottom section with description and technologies -->
          <div class="flex-1 flex flex-col justify-between">
            <!-- Positions section -->
            <CardItem
              v-if="experience.positions?.length"
              :translateZ="25"
              class="mb-6"
            >
              <div class="space-y-3">
                <h4 class="text-base font-medium text-indigo-400/90">
                  Positions
                </h4>
                <div class="space-y-3 border-t border-slate-800/50 pt-3">
                  <div
                    v-for="(pos, index) in experience.positions"
                    :key="index"
                    class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-sm"
                  >
                    <span class="text-slate-200 font-medium">{{
                      pos.title
                    }}</span>
                    <span class="text-slate-400 text-sm">{{
                      pos.duration
                    }}</span>
                  </div>
                </div>
              </div>
            </CardItem>

            <CardItem :translateZ="25">
              <ul
                class="space-y-2 md:space-y-3 list-disc list-inside text-slate-300 text-sm md:text-base"
                role="list"
              >
                <li
                  v-for="(item, i) in experience.description"
                  :key="i"
                  class="leading-relaxed hover:text-violet-400 transition-colors"
                >
                  {{ item }}
                </li>
              </ul>
            </CardItem>

            <CardItem class="flex flex-wrap gap-2 pt-4" :translateZ="35">
              <Badge
                v-for="tech in experience.technologies"
                :key="tech"
                variant="secondary"
                class="px-3 py-1.5 text-xs bg-slate-900/50 hover:bg-violet-500/20 hover:text-violet-400 hover:scale-110 transition-all duration-300 border border-slate-800"
              >
                {{ tech }}
              </Badge>
            </CardItem>
          </div>
        </CardItem>
      </CardContent>
    </Card>
  </CardContainer>
</template>

<style scoped>
.shadow-glow {
  box-shadow: 0 0 30px -5px rgb(124 58 237 / 0.3),
    0 8px 16px -2px rgb(124 58 237 / 0.2), 0 4px 8px -2px rgb(124 58 237 / 0.1);
}

@keyframes glow {
  0%,
  100% {
    filter: brightness(1);
    opacity: 0.8;
  }
  50% {
    filter: brightness(1.3);
    opacity: 1;
  }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(124 58 237 / 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(124 58 237 / 0.3);
  border-radius: 20px;
}
</style>
