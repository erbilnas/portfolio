<template>
  <div class="container mx-auto px-4">
    <div class="grid gap-8 md:grid-cols-2">
      <div
        v-for="project in projects"
        :key="project.name"
        class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 p-8 transition-all duration-500 hover:scale-[1.02] hover:from-white/10 hover:to-white/15 backdrop-blur-lg border border-white/10"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div class="relative flex flex-col gap-6">
          <div class="flex items-start justify-between">
            <div>
              <h3
                class="text-2xl font-bold text-white flex items-center gap-3 mb-2"
              >
                {{ project.name }}
                <a
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Icon name="mdi:github" class="w-6 h-6" />
                </a>
              </h3>
              <p class="text-sm font-medium text-gray-400">
                {{ project.tech.join(" • ") }}
              </p>
            </div>
            <span
              class="text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-300"
              :class="{
                'bg-green-500/20 text-green-300 ring-1 ring-green-500/30':
                  project.status === 'Active',
                'bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/30':
                  project.status === 'In Progress',
                'bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/30':
                  project.status === 'Archived',
              }"
            >
              {{ project.status }}
            </span>
          </div>
          <p class="text-gray-300 leading-relaxed">{{ project.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="feature in project.features"
              :key="feature"
              class="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/20"
            >
              {{ feature }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  name: string;
  description: string;
  tech: string[];
  features: string[];
  status: "Active" | "In Progress" | "Archived";
  github?: string;
}

const projects: Project[] = [
  {
    name: "erbilnas.com",
    description:
      "Personal website built with modern web technologies, featuring a unique design and interactive elements.",
    tech: ["Vue.js", "Nuxt.js", "TailwindCSS", "TypeScript"],
    features: [
      "Dark Mode",
      "Responsive Design",
      "Interactive UI",
      "SEO Optimized",
    ],
    status: "Active",
    github: "https://github.com/erbilnas/erbilnas-com",
  },
  {
    name: "Perfanalytics",
    description:
      "A web analytics tool focused on performance metrics and user experience monitoring.",
    tech: ["Node.js", "MongoDB", "Vue.js", "Docker"],
    features: [
      "Real-time Analytics",
      "Performance Monitoring",
      "API Integration",
    ],
    status: "In Progress",
    github: "https://github.com/erbilnas/perfanalytics",
  },
];
</script>
