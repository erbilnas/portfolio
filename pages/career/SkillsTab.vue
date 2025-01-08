<template>
  <div class="container mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in skillCategories"
        :key="category.name"
        class="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300"
      >
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon :name="category.icon" class="w-6 h-6" />
            {{ category.name }}
          </h3>
          <div class="space-y-4">
            <div
              v-for="skill in category.skills"
              :key="skill.name"
              class="space-y-2"
            >
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-300">{{ skill.name }}</span>
                <span class="text-xs text-gray-400">{{ skill.level }}</span>
              </div>
              <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-violet-500 to-red-500 rounded-full transition-all duration-500"
                  :style="{ width: `${skill.percentage}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Skill {
  name: string;
  level: string;
  percentage: number;
}

interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    icon: "mdi:web",
    skills: [
      { name: "Vue.js", level: "Expert", percentage: 95 },
      { name: "React", level: "Advanced", percentage: 85 },
      { name: "TypeScript", level: "Expert", percentage: 90 },
      { name: "TailwindCSS", level: "Expert", percentage: 95 },
    ],
  },
  {
    name: "Backend",
    icon: "mdi:server",
    skills: [
      { name: "Node.js", level: "Expert", percentage: 90 },
      { name: "Express", level: "Advanced", percentage: 85 },
      { name: "MongoDB", level: "Advanced", percentage: 80 },
      { name: "PostgreSQL", level: "Advanced", percentage: 85 },
    ],
  },
  {
    name: "DevOps",
    icon: "mdi:cloud",
    skills: [
      { name: "Docker", level: "Advanced", percentage: 85 },
      { name: "AWS", level: "Intermediate", percentage: 70 },
      { name: "CI/CD", level: "Advanced", percentage: 80 },
      { name: "Linux", level: "Advanced", percentage: 85 },
    ],
  },
];
</script>
