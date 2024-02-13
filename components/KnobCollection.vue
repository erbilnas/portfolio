<template>
  <Card v-if="!isLoading">
    <template #content>
      <div class="flex-centered-row">
        <div class="flex-centered-column">
          <Knob v-model="age" :strokeWidth="5" readonly />
          <p>Age</p>
        </div>

        <div class="flex-centered-column">
          <Knob v-model="experience" :strokeWidth="5" readonly :max="35" />
          <p>Experience</p>
        </div>
      </div>
    </template>
  </Card>

  <Card v-else>
    <template #content>
      <div class="flex-centered-row">
        <div class="flex-centered-column">
          <Skeleton shape="circle" size="8rem"></Skeleton>
        </div>

        <div class="flex-centered-column">
          <Skeleton shape="circle" size="8rem"></Skeleton>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
const dayjs = useDayjs()

const config = useRuntimeConfig()

const isLoading = ref(true)

const age = dayjs().diff(dayjs(config.public.birthday), 'year')
const experience = dayjs().diff(dayjs(config.public.firstExperienceDate), 'year')

onMounted(() => {
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .p-card {
    align-items: center;
  }
}

.flex-centered-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-centered-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
</style>