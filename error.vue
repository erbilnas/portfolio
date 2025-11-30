<template>
  <div class="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
    <div class="max-w-2xl w-full space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
          {{ error.statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ error.statusCode === 404 
            ? 'The page you are looking for does not exist.' 
            : 'An unexpected error occurred. Please try again later.' }}
        </p>
      </div>

      <!-- Error Details - Always show in production for debugging -->
      <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Error Details</h2>
          <button
            @click="showDetails = !showDetails"
            class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {{ showDetails ? 'Hide' : 'Show' }} Details
          </button>
        </div>

        <div v-show="showDetails" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status Code</label>
            <div class="mt-1 text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 p-2 rounded border">
              {{ error.statusCode || 'N/A' }}
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Error Message</label>
            <div class="mt-1 text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 p-2 rounded border break-words">
              {{ error.message || 'No error message available' }}
            </div>
          </div>

          <div v-if="error.statusMessage">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status Message</label>
            <div class="mt-1 text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 p-2 rounded border">
              {{ error.statusMessage }}
            </div>
          </div>

          <div v-if="error.stack">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Stack Trace</label>
            <div class="mt-1 text-xs text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 p-3 rounded border overflow-auto max-h-60 whitespace-pre-wrap break-words">
              {{ error.stack }}
            </div>
          </div>

          <div v-if="error.data">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Data</label>
            <div class="mt-1 text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 p-3 rounded border overflow-auto max-h-60">
              <pre>{{ JSON.stringify(error.data, null, 2) }}</pre>
            </div>
          </div>

          <div v-if="error.url">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
            <div class="mt-1 text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 p-2 rounded border break-all">
              {{ error.url }}
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp</label>
            <div class="mt-1 text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 p-2 rounded border">
              {{ new Date().toISOString() }}
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">User Agent</label>
            <div class="mt-1 text-xs text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 p-2 rounded border break-all">
              {{ userAgent }}
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleError"
          class="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          Go to Homepage
        </button>
        <button
          @click="reloadPage"
          class="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
    stack?: string;
    data?: any;
    url?: string;
  };
}>();

const showDetails = ref(true); // Show by default
const userAgent = ref('N/A');

onMounted(() => {
  if (process.client && typeof navigator !== 'undefined') {
    userAgent.value = navigator.userAgent;
  }
  
  // Log error details to console in production
  console.error('Error Details:', {
    statusCode: props.error.statusCode,
    statusMessage: props.error.statusMessage,
    message: props.error.message,
    stack: props.error.stack,
    data: props.error.data,
    url: props.error.url,
    timestamp: new Date().toISOString(),
    userAgent: userAgent.value,
    fullError: props.error,
  });
  
  // Log stack trace separately for better visibility
  if (props.error.stack) {
    console.error('Stack Trace:', props.error.stack);
  }
});

const handleError = () => {
  clearError({ redirect: '/' });
};

const reloadPage = () => {
  if (process.client) {
    window.location.reload();
  }
};
</script>

