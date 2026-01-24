<template>
  <div
    v-if="expensesStore.loadingList"
    class="defaultPageContainer d-flex align-center justify-center"
  >
    <v-progress-circular
      color="primary"
      size="250"
      width="10"
      indeterminate
    />
  </div>

  <div
    v-else
    class="defaultPageContainer"
  >
    <h1
      :class="{
        'mb-4': true,
        'onlyForScreenReader': vuetifyDisplay.smAndDown.value,
      }"
    >
      Resumo Geral
    </h1>

    <div class="homePageGrid w-100">
      <section class="expensesBars defaultWhiteCard d-flex align-start justify-start flex-column">
        <h2>
          Como foi a sua semana
        </h2>

        <charts-expenses-bars
          height="500px"
        />
      </section>

      <section class="expensesPie defaultWhiteCard d-flex align-start justify-start flex-column">
        <h2>
          Entradas e saídas
        </h2>

        <charts-expenses-pie
          height="400px"
          class="mx-auto"
        />
      </section>

      <section class="mainExpenses defaultWhiteCard d-flex align-start justify-start flex-column">
        <h2>
          Principais despesas
        </h2>

        <commons-warning-screen
          v-if="expensesByType.length === 0"
          description="As principais despesas aparecem aqui."
        >
          <template #image>
            <commons-theme-image
              :aspect-ratio="1"
              base-path="/images/illustrations"
              filename="checklist.svg"
              class="mx-auto flex-fill"
              min-width="200px"
              width="200px"
            />
          </template>

          <template #title>
            <h3>
              Nenhum registro adicionado
            </h3>
          </template>
        </commons-warning-screen>

        <v-list
          v-else
          class="w-100"
          bg-color="card"
        >
          <v-list-item
            v-for="expenseData in expensesByType"
            :key="expenseData.type"
            :class="{
              'py-5 px-0': true,
            }"
          >
            <template #prepend>
              <v-avatar
                color="secondary"
              >
                <v-icon>
                  {{ getExpenseTypeData(expenseData.type)?.icon }}
                </v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>
              {{ getExpenseTypeData(expenseData.type)?.name }}
            </v-list-item-title>

            <template #append>
              <div>
                {{ expenseData.currency }}{{ Math.abs(expenseData.value).toFixed(2) }}
              </div>
            </template>
          </v-list-item>
        </v-list>
      </section>

      <section class="latestExpenses defaultWhiteCard overflow-hidden">
        <h2 class="mb-4">
          Movimentações recentes
        </h2>

        <commons-warning-screen
          v-if="lastSevenDaysExpenses.length === 0"
          description="As movimentações recentes aparecem aqui."
        >
          <template #image>
            <commons-theme-image
              :aspect-ratio="1"
              base-path="/images/illustrations"
              filename="coins.svg"
              class="mx-auto"
              min-width="200px"
              width="200px"
            />
          </template>

          <template #title>
            <h3>
              Nenhum registro adicionado
            </h3>
          </template>
        </commons-warning-screen>

        <v-list
          v-else
          bg-color="card"
          class="pa-0"
        >
          <v-list-item
            v-for="expenseData in lastSevenDaysExpenses"
            :key="expenseData.id"
            :class="{
              'py-5 px-0': true,
            }"
          >
            <template #prepend>
              <v-avatar
                :color="expenseData.value > 0 ? 'primary' : 'secondary'"
              >
                <v-icon>
                  {{ getExpenseTypeData(expenseData.type)?.icon }}
                </v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>
              {{ getExpenseTypeData(expenseData.type)?.name }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ dateToLargeStr(expenseData.expenseDate) }}
            </v-list-item-subtitle>

            <template #append>
              <div>
                {{ expenseData.currency }}{{ Math.abs(expenseData.value).toFixed(2) }}
              </div>
            </template>
          </v-list-item>
        </v-list>
      </section>
    </div>

    <v-fab
      v-if="vuetifyDisplay.smAndDown.value"
      class="homePageAddButton"
      color="primary"
      size="large"
      icon
      app
      @click="$router.push({
        path: '/expenses',
        query: { autofocus: 'true' },
      })"
    >
      <v-icon size="30">
        mdi-plus
      </v-icon>
    </v-fab>

    <v-btn
      v-else
      class="homePageAddButton"
      color="primary"
      size="large"
      position="absolute"
      rounded
      flat
      @click="$router.push({
        path: '/expenses',
        query: { autofocus: 'true' },
      })"
    >
      <v-icon start>
        mdi-plus-circle
      </v-icon>

      Adicionar
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useDisplay } from 'vuetify'
import { useExpensesStore } from '~/stores/cruds/expenses'

definePageMeta({
  middleware: 'authenticated',
})

const authStore = useAuthStore()

if (!authStore.databaseUser) {
  throw new Error('Unauthenticated')
}

const vuetifyDisplay = useDisplay()

const expensesStore = useExpensesStore()

const lastSevenDaysExpenses = computed(() => filterByTheLastSevenDays(expensesStore.items, 'expenseDate'))

const expensesByType = computed(() => {
  interface ExpenseTypeData {
    type: string
    value: number
    icon: string
    currency: string
  }

  const expenseTypesData: ExpenseTypeData[] = []

  for (const expenseData of lastSevenDaysExpenses.value) {
    if (expenseData.value < 0) {
      const expenseTypeDataItem = expenseTypesData.find(item => item.type === expenseData.type)

      if (expenseTypeDataItem) {
        expenseTypeDataItem.value += Math.abs(expenseData.value)
      } else {
        const expenseType = expenseTypes.find(typeData => typeData.name === expenseData.type)

        expenseTypesData.push({
          type: expenseData.type,
          value: Math.abs(expenseData.value),
          icon: expenseType?.icon || '',
          currency: 'R$',
        })
      }
    }
  }

  return expenseTypesData
})
</script>

<style lang="scss" scoped>
.homePageSection {
  flex: 1 1 0;
}

.homePageAddButton {
  top: 32px;
  right: 32px;
}

// .homePageAside {
//   height: 100%;

//   width: 35%;

//   max-width: 450px;

//   .v-list {
//     // Item height = 80px
//     min-height: 800px;
//   }
// }

.homePageGrid {
  display: grid;

  height: 1200px;
  width: 100%;

  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;

  grid-template-areas:
    "expensesBars expensesBars latestExpenses"
    "expensesPie mainExpenses latestExpenses";

  gap: 24px;

  .expensesBars {
    grid-area: expensesBars;
    // grid-row: 1 / 2;
    // grid-column: 1 / 3;
  }

  .mainExpenses {
    grid-area: mainExpenses;
  }

  .expensesPie {
    grid-area: expensesPie;
    // grid-row: 2 / 3;
    // grid-column: 1 / 2;
  }

  .latestExpenses {
    grid-area: latestExpenses;
    // grid-row: 1 / 3;
    // grid-column: 3 / 4;
  }
}

@media(max-width: 1280px) {
  .homePageGrid {
    height: auto;

    grid-template-areas:
      "expensesBars expensesBars expensesBars"
      "expensesPie expensesPie expensesPie"
      "mainExpenses mainExpenses mainExpenses"
      "latestExpenses latestExpenses latestExpenses";
  }
}

@media(max-width: 960px) {
  .homePageAddButton {
    top: auto;
    right: 10px;
    bottom: 90px;
  }
}
</style>
