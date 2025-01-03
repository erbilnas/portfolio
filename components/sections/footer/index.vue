<script setup lang="ts">
const socialLinks = [
  {
    icon: "mdi:github",
    url: "https://github.com/erbilnas",
  },
  {
    icon: "mdi:linkedin",
    url: "https://www.linkedin.com/in/erbilnas",
  },
  {
    icon: "simple-icons:medium",
    url: "https://medium.com/@erbilnas",
  },
  {
    icon: "simple-icons:bluesky",
    url: "https://bsky.app/profile/erbilnas.com",
  },
] as const;
</script>

<template>
  <section
    id="footer"
    class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-zinc-950 to-slate-950 gap-8"
  >
    <!-- Copyright -->
    <div class="text-center space-y-2">
      <p class="text-sm text-white/60">
        Built with Nuxt 3, TypeScript, and Tailwind CSS.
      </p>
      <p class="text-sm text-white/60">
        © {{ new Date().getFullYear() }} Erbil Nas. All rights reserved.
      </p>
    </div>
  </section>
</template>

<style scoped>
.code-rain {
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(139, 92, 246, 0.3) 50%,
    rgba(139, 92, 246, 0.1) 100%
  );
  background-size: 100% 100%;
  animation: rain 2s linear infinite;
  mask-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='14' fill='white'%3E01%3C/text%3E%3C/svg%3E");
  mask-size: 24px 24px;
}

@keyframes rain {
  from {
    transform: translateY(-50%);
  }
  to {
    transform: translateY(50%);
  }
}
</style>
