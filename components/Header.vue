<template>
  <header>
    <ProgressBar v-if="isLoading" mode="indeterminate" style="height: 6px"></ProgressBar>

    <div class="navigation">
      <span v-if="!isLoading" class="p-buttonset">
        <Button :label="!isMobile ? 'Home' : ''" icon="pi pi-home" text outlined />
        <Button :label="!isMobile ? 'About Me' : ''" icon="pi pi-user" text outlined disabled
          :badge="!isMobile ? 'soon' : ''" badgeSeverity="contrast" />
        <Button :label="!isMobile ? 'Works' : ''" icon="pi pi-briefcase" text outlined disabled
          :badge="!isMobile ? 'soon' : ''" badgeSeverity="contrast" />
        <Button :label="!isMobile ? 'Contact' : ''" icon="pi pi-phone" text outlined disabled
          :badge="!isMobile ? 'soon' : ''" badgeSeverity="contrast" />
      </span>

      <Skeleton v-else width="10rem" height="3rem"></Skeleton>
    </div>
  </header>
</template>

<script lang="ts" setup>
const isMobile = ref(false)
const isLoading = ref(true)

onMounted(() => {
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
  padding: 5vh 0 10vh 0;
}
</style>