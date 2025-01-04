<script setup lang="ts">
interface TechStack {
  name: string;
  url: string;
  icon: string;
}

const version = useRuntimeConfig().public.version;

const techStack: TechStack[] = [
  { name: "Nuxt", url: "https://nuxt.com", icon: "simple-icons:nuxtdotjs" },
  { name: "Vue", url: "https://vuejs.org", icon: "simple-icons:vuedotjs" },
  {
    name: "TypeScript",
    url: "https://typescript.com",
    icon: "simple-icons:typescript",
  },
  {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com",
    icon: "simple-icons:tailwindcss",
  },
];
</script>

<template>
  <section
    id="footer"
    class="flex flex-col items-center justify-end p-4 bg-gradient-to-b from-zinc-950 to-slate-950 gap-8 pb-32"
  >
    <div class="flex flex-col items-center gap-4">
      <TooltipProvider>
        <div class="flex items-center gap-2">
          <template v-for="tech in techStack" :key="tech.name">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  :href="tech.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon :name="tech.icon" class="w-5 h-5" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{{ tech.name }}</p>
              </TooltipContent>
            </Tooltip>
          </template>
        </div>
      </TooltipProvider>

      <div class="text-center space-y-2">
        <div class="flex flex-col items-center gap-2">
          <p class="text-xs text-white/40">Version {{ version }}</p>

          <p class="text-xs text-white/50">
            The game data provided by HowLongToBeat.com | The song data provided
            by Spotify.
          </p>
        </div>

        <p class="text-sm text-white/60">
          {{ new Date().getFullYear() }} © Erbil Nas. Made with ❤️ in Turkey.
        </p>
      </div>
    </div>
  </section>
</template>
