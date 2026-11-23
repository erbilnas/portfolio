<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const { clearError } = useNuxtApp();
const config = useRuntimeConfig();
const showErrorsInPreview = config.public.showErrorsInPreview as boolean;

const errorMessage = computed(() => {
  if (showErrorsInPreview && props.error?.message) {
    return props.error.message;
  }
  return props.error?.statusCode === 404
    ? "Page not found"
    : "Something went wrong";
});

const errorStack = computed(() => {
  if (!showErrorsInPreview || !props.error) return null;
  const err = props.error as Error & { stack?: string };
  return err.stack ?? null;
});
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground"
  >
    <div class="max-w-2xl w-full space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-bold text-destructive">
          {{ error?.statusCode ?? 500 }}
        </h1>
        <p class="text-lg text-muted-foreground">{{ errorMessage }}</p>
      </div>

      <!-- Preview: show full error details -->
      <div
        v-if="showErrorsInPreview && error"
        class="rounded-lg border border-destructive/50 bg-destructive/5 p-4 font-mono text-sm overflow-auto max-h-64"
      >
        <p class="font-semibold text-destructive mb-2">
          Error details (preview)
        </p>
        <pre class="whitespace-pre-wrap break-words text-muted-foreground">{{
          JSON.stringify(
            {
              statusCode: error.statusCode,
              message: error.message,
              statusMessage: (error as any).statusMessage,
            },
            null,
            2,
          )
        }}</pre>
        <pre
          v-if="errorStack"
          class="mt-4 whitespace-pre-wrap break-words text-xs text-muted-foreground"
          >{{ errorStack }}</pre
        >
      </div>

      <div class="flex justify-center gap-4">
        <Button as="a" href="/" variant="default">
          {{ $t("common.goBack") }}
        </Button>
        <Button
          type="button"
          variant="outline"
          @click="(clearError as any)({ redirect: '/' })"
        >
          {{ $t("common.retry") }}
        </Button>
      </div>
    </div>
  </div>
</template>
