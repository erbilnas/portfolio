<template>
  <main>
    <div class="container">
      <div class="flex-column">
        <ProfileCard />

        <ListeningNowCard />

        <div class="flex-row">
          <KnobCollection />

          <GithubCard />
        </div>
      </div>

      <div class="flex-column">
        <PlayingNowCard />

        <WorkingCompanyCard />
      </div>

      <div class="flex-column">
        <RecentPostCard />

        <PlacesBeenCard />
      </div>
    </div>

    <AboutMeSidebar />
  </main>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.p-card {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  border-color: var(--primary-color);
  border-style: solid;
  border-width: 0.1rem;

  flex: auto;

  &:hover {
    box-shadow: 0 0 1rem var(--primary-color);
    transition: box-shadow 0.3s ease;
  }
}

.container {
  display: flex;
  justify-content: center;
  padding: 0 10vw;
  gap: 1rem;

  @media (max-width: 1180px) {
    flex-direction: column;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}
</style>