<template>
  <header>
    <ProgressBar v-if="isLoading" mode="indeterminate" class="progress-bar" />

    <div class="navigation">
      <ButtonGroup v-if="!isLoading">
        <Button :label="!isMobile ? 'Home' : ''" icon="pi pi-home" text outlined @click="router.push('/')" />

        <Button :label="!isMobile ? 'Career' : ''" icon="pi pi-briefcase" text outlined
          @click="router.push('/career')" />

        <Button :label="!isMobile ? 'About' : ''" icon="pi pi-user" text outlined disabled
          :badge="!isMobile ? 'soon' : ''" badgeSeverity="contrast" />

        <Button :label="!isMobile ? 'Contact' : ''" icon="pi pi-phone" text outlined disabled
          :badge="!isMobile ? 'soon' : ''" badgeSeverity="contrast" />
      </ButtonGroup>

      <Skeleton v-else :width="!isMobile ? '30vw' : '10rem'" height="3rem" />
    </div>
  </header>
</template>

<script lang="ts" setup>
const router = useRouter()

const isMobile = ref(false)
const isLoading = ref(true)

onNuxtReady(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true
  }

  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5vh 0;
}

.progress-bar {
  height: 6px;
}
</style>