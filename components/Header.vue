<template>
  <header>
    <div class="navigation">
      <span class="p-buttonset">
        <Button :label="!isMobile ? 'Home' : ''" icon="pi pi-home" text outlined />
        <Button :label="!isMobile ? 'About Me' : ''" icon="pi pi-user" text outlined disabled
          :badge="!isMobile ? 'soon' : ''" badgeSeverity="contrast" />
        <Button :label="!isMobile ? 'Works' : ''" icon="pi pi-briefcase" text outlined disabled
          :badge="!isMobile ? 'soon' : ''" badgeSeverity="contrast" />
        <Button :label="!isMobile ? 'Contact' : ''" icon="pi pi-phone" text outlined disabled
          :badge="!isMobile ? 'soon' : ''" badgeSeverity="contrast" />
      </span>
    </div>
  </header>
</template>

<script lang="ts" setup>
const isMobile = ref(false)

onMounted(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true
  }
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