<template>
  <main>
    <div class="flex-column">
      <CardSummary class="summary-card" />
      <CardSpotify />

      <div class="flex-row">
        <KnobCollection />
        <CardGithub />
      </div>
    </div>

    <div class="flex-column">
      <CardHLTB />

      <CardWorkingCompany />
    </div>

    <div class="flex-column">
      <CardRecentPosts />

      <div class="flex-row">
        <CardPlacesBeen />
        <CardGoodreads />
      </div>
    </div>

    <ScrollTop />
  </main>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
  gap: 1rem;

  .p-card {
    cursor: pointer;
    transition: box-shadow 0.3s ease;
    flex: auto;

    &:hover {
      box-shadow: 0 0 0.5rem var(--primary-color);
      background: linear-gradient(
        45deg,
        var(--primary-color),
        var(--secondary-color)
      );
      transition: box-shadow 0.3s ease;
    }
  }

  .summary-card {
    cursor: default;
  }

  .flex-row {
    display: flex;
    flex: 1;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .flex-column {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 1366px) {
    flex-direction: column;
  }
}
</style>
