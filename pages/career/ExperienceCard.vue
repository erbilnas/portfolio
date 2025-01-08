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
}

const props = defineProps<Props>();
</script>

<template>
  <CardContainer>
    <Card
      v-if="isActive"
      class="md:w-[calc(100vw/4)] w-[calc(100vw-4rem)] bg-gradient-to-br from-slate-950 to-slate-900 backdrop-blur-sm hover:shadow-glow transition-all duration-300 border border-slate-800/50"
    >
      <!-- Full content for active cards -->
      <CardContent class="h-full p-2 sm:p-4 md:p-6 overflow-y-auto">
        <CardItem class="flex flex-col h-full gap-1 sm:gap-2 md:gap-4">
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
