<template>
  <div class="defaultPageContainer achievementsPage">
    <h1 class="mb-4">
      Conquistas
    </h1>

    <p class="mb-8">
      Acompanhe o seu progresso na plataforma e desbloqueie recompensas!
    </p>

    <v-tabs
      v-model="selectedTab"
      class="mb-5"
    >
      <v-tab value="achievements">
        Conquistas
      </v-tab>

      <v-tab value="rewards">
        Recompensas
      </v-tab>
    </v-tabs>

    <v-tabs-window
      v-model="selectedTab"
      class="overflow-visible"
    >
      <v-tabs-window-item value="achievements">
        <section class="cardsGrid">
          <header class="onlyForScreenReader">
            <h2 class="d-none">
              Lista de conquistas
            </h2>
          </header>

          <article
            v-for="(achievementData, achievementIndex) in achievementsStore.items"
            :key="`achievementIndex${achievementIndex}`"
            :class="{
              'defaultWhiteCard achievementCard text-center d-flex align-center justify-space-between flex-column': true,
            }"
          >
            <div>
              <v-avatar
                :color="vuetifyTheme.current.value.colors[achievementData.color]"
                class="achievementIcon mb-3"
                size="150"
              >
                <v-icon
                  size="80"
                >
                  {{ achievementData.icon }}
                </v-icon>
              </v-avatar>
            </div>

            <div class="w-100">
              <h3>
                {{ achievementData.title }}
              </h3>

              <p class="mb-10">
                {{ achievementData.description }}
              </p>

              <div class="w-100 d-flex align-center justify-center ga-2">
                <v-progress-linear
                  :model-value="getAchievementProgress(achievementData)"
                  :color="getAchievementProgress(achievementData) === 100 ? 'primary' : 'blue'"
                  height="12"
                  rounded
                />

                <span class="font-weight-medium">
                  {{ achievementData.currentStep }}/{{ achievementData.totalSteps }}
                </span>
              </div>
            </div>
          </article>
        </section>
      </v-tabs-window-item>

      <v-tabs-window-item
        value="rewards"
      >
        <section class="cardsGrid">
          <header class="onlyForScreenReader">
            <h2 class="d-none">
              Temas conquistados
            </h2>
          </header>

          <v-card
            v-for="(themeData, themeIndex) in themesStore.themesData"
            :key="`themeIndex${themeIndex}`"
            :class="{
              'text-center ultraRounded py-5 themeCard': true,
              'isActive': themesStore.currentTheme === themeData.id,
            }"
            color="card"
            :disabled="!themeData.allowed"
            flat
            @click="themesStore.setTheme(themeData.id)"
          >
            <div class="pa-5">
              <icons-dynamic-theme-icon
                :colors="themeData.colors"
              />
            </div>

            <v-card-title>
              {{ themeData.title }}
            </v-card-title>

            <v-card-text>
              {{ themeData.description }}
            </v-card-text>
          </v-card>
        </section>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

definePageMeta({
  middleware: 'authenticated',
})

const achievementsStore = useAchievementsStore()

const vuetifyTheme = useTheme()

const themesStore = useThemesStore()

const route = useRoute()
const router = useRouter()

const selectedTab = computed({
  get() {
    return route.query.tab ?? 'achievements'
  },

  set(newValue) {
    router.push({ query: { tab: newValue } })
  },
})

function getAchievementProgress(achievementData: AchivementData) {
  return achievementData.currentStep / achievementData.totalSteps * 100
}
</script>

<style lang="scss">
.achievementsPage .cardsGrid {
  display: grid;

  // https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

  gap: 24px;

  .achievementCard {
    aspect-ratio: 3 / 4;

    &.zeroProgress {
      opacity: 0.5;
    }

    h3 {
      font-size: 1.5rem;
    }
  }

  .themeCard {
    &.isActive {
      outline: 3px solid rgb(var(--v-theme-primary));
    }

    * {
      letter-spacing: 0 !important;
    }
  }
}

@media(max-width: 600px) {
  .achievementsPage .cardsGrid .achievementCard {
    aspect-ratio: auto;
  }
}
</style>
