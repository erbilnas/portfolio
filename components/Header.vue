<template>
  <header>
    <div class="navigation">
      <span class="p-buttonset">
        <Button label="Home" icon="pi pi-home" text outlined />
        <Button label="About Me" icon="pi pi-user" text outlined disabled badge="soon" badgeSeverity="contrast" />
        <Button label="Works" icon="pi pi-briefcase" text outlined disabled badge="soon" badgeSeverity="contrast" />
        <Button label="Contact" icon="pi pi-phone" text outlined disabled badge="soon" badgeSeverity="contrast" />
      </span>
    </div>

    <div class="mobile-navigation">
      <Button icon="pi pi-bars" label="Menu" />
    </div>
  </header>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5vh 0 10vh 0;

  @media (max-width: 768px) {
    display: none;
  }
}

.mobile-navigation {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: flex-start;
    padding: 5vh 10vw;
  }
}
</style>