<template>
  <div class="relative aspect-[16/9] w-full overflow-hidden">
    <div
      class="absolute inset-0 bg-gradient-to-br from-red-950 to-red-900"
    ></div>
    <div
      class="absolute inset-0 p-6 flex flex-col justify-center items-center text-center"
    >
      <h2 class="text-2xl font-bold text-white mb-4">Service Unavailable</h2>
      <p class="text-white/80 max-w-md">
        Sorry, we couldn't load the data at this time. This could be due to API
        rate limits or service unavailability. Please try again later.
      </p>
    </div>
  </div>
</template>
