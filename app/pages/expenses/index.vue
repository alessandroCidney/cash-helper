<template>
  <div class="defaultPageContainer d-flex align-start justify-start flex-column">
    <h1 class="mb-4 onlyForScreenReader">
      Novo registro
    </h1>

    <section class="mb-8 w-100">
      <v-btn-toggle
        v-model="selectedMode"
        :color="selectedMode === 'expense' ? 'secondary' : 'primary'"
        :class="{
          'mb-4 ultraRounded w-100': true,
          'w-100': vuetifyDisplay.xs.value,
        }"
      >
        <v-btn
          :class="{
            'flex-fill': vuetifyDisplay.xs.value,
          }"
          value="expense"
          size="large"
        >
          <v-icon start>
            mdi-minus-circle
          </v-icon>

          {{ vuetifyDisplay.xs.value ? 'Despesa' : 'Nova Despesa' }}
        </v-btn>

        <v-btn
          :class="{
            'flex-fill': vuetifyDisplay.xs.value,
          }"
          value="income"
          size="large"
        >
          <v-icon start>
            mdi-plus-circle
          </v-icon>

          {{ vuetifyDisplay.xs.value ? 'Entrada' : 'Nova Entrada' }}
        </v-btn>
      </v-btn-toggle>

      <v-form
        ref="createExpenseForm"
        v-model="createExpenseFormIsValid"
        class="d-flex align-center justify-start flex-column flex-md-row ga-4"
        autocomplete="off"
        @submit.prevent="handleCreateExpense"
      >
        <div
          :class="{
            'bg-card giantInput d-flex align-center justify-start px-6': true,
            'isFocused': valueFieldIsFocused,
          }"
        >
          <div>R$</div>

          <forms-number-text-field
            v-model="createExpenseFormPayload.value"
            v-model:focused="valueFieldIsFocused"
            :rules="[formRules.requiredNumber, formRules.numberGreaterThanZero]"
            :autofocus="$route.query.autofocus === 'true'"
            :disabled="expensesStore.loadingCreate"
            :step="0.05"
            :min="0"
            bg-color="card"
            variant="solo"
            hide-details
            rounded
            flat
          />
        </div>

        <div
          :class="{
            'bg-card giantInput d-flex align-center justify-start px-6': true,
            'isFocused': typeFieldIsFocused,
          }"
        >
          <v-combobox
            v-model="createExpenseFormPayload.type"
            v-model:focused="typeFieldIsFocused"
            :rules="[formRules.requiredString]"
            :items="expenseTypes.filter(item => item.type === selectedMode).map(item => item.name)"
            :disabled="expensesStore.loadingCreate"
            bg-color="card"
            placeholder="Selecionar tipo"
            variant="solo"
            hide-details
            rounded
            flat
          />
        </div>

        <v-btn
          :color="selectedMode === 'expense' ? 'secondary' : 'primary'"
          :loading="expensesStore.loadingCreate"
          :icon="vuetifyDisplay.mdAndUp.value"
          :block="vuetifyDisplay.smAndDown.value"
          :rounded="vuetifyDisplay.smAndDown.value || undefined"
          variant="flat"
          type="submit"
          :size="vuetifyDisplay.smAndDown.value ? 'x-large' : 70"
        >
          <v-icon
            :start="vuetifyDisplay.smAndDown.value"
            :size="vuetifyDisplay.smAndDown.value ? 30 : 50"
          >
            mdi-plus
          </v-icon>

          <span v-if="vuetifyDisplay.smAndDown.value">
            Adicionar
          </span>
        </v-btn>
      </v-form>
    </section>

    <section class="bg-card pa-8 ultraRounded w-100 d-flex align-start justify-start flex-column flex-fill">
      <h2>Registros anteriores</h2>

      <commons-warning-screen
        v-if="expensesStore.items.length === 0"
        title="Nenhum registro adicionado"
        description="Os registros adicionados aparecem aqui."
      >
        <template #image>
          <commons-theme-image
            :aspect-ratio="900 / 600"
            base-path="/images/illustrations"
            filename="money.svg"
            class="mx-auto"
            min-width="200px"
            width="300px"
          />
        </template>
      </commons-warning-screen>

      <v-data-table
        v-else
        :items="expensesStore.items"
        :headers="expenseTableHeaders"
        items-per-page-text="Itens por página:"
        class="expensesTable bg-card flex-fill"
      >
        <template #[`item.type`]="{ item: expenseData }">
          <v-avatar
            :color="expenseData.value > 0 ? 'primary' : 'secondary'"
            class="mr-3"
          >
            <v-icon>
              {{ getExpenseTypeData(expenseData.type)?.icon }}
            </v-icon>
          </v-avatar>

          <span class="font-weight-medium">
            {{ expenseData.type }}
          </span>
        </template>

        <template #[`item.createdAt`]="{ item: expenseData }">
          {{ dateToLargeStr(expenseData.expenseDate) }}
        </template>

        <template #[`item.value`]="{ item: expenseData }">
          {{ expenseData.currency }} {{ Math.abs(expenseData.value).toFixed(2) }}
        </template>

        <template #[`item.actions`]="{ item: expenseData }">
          <commons-form-dialog
            :base-payload="expenseData"
            :confirm="(finalPayload) => expensesStore.update(finalPayload as DatabaseExpense)"
          >
            <template #title>
              Editar registro
            </template>

            <template #text>
              <p class="mb-4">
                Atualize as informações do seu registro!
              </p>
            </template>

            <template #form="{ internalPayload }">
              <pages-expenses-expense-value-field
                v-model="internalPayload.value"
                @update:mode="internalPayload.type = ''"
              />

              <v-combobox
                v-model="internalPayload.type"
                :rules="[formRules.requiredString]"
                :items="expenseTypes.filter(item => item.type === (internalPayload.value > 0 ? 'income' : 'expense')).map(item => item.name)"
                label="Tipo"
              />

              <forms-datetime-text-field
                v-model="internalPayload.expenseDate"
                :rules="[formRules.requiredString, formRules.validDatetime]"
                :max="getMaxInputDatetime()"
                :min="getMinInputDatetime()"
                label="Data da despesa"
                flat
              />
            </template>

            <template #activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                icon="mdi-pencil"
                color="secondary"
                variant="text"
                class="mr-2"
                flat
              />
            </template>
          </commons-form-dialog>

          <commons-confirm-dialog
            :confirm="() => expensesStore.remove(expenseData.id)"
          >
            <template #title>
              Excluir registro
            </template>

            <template #text>
              <p>
                O registro será excluído e não poderá ser recuperado. Deseja continuar?
              </p>
            </template>

            <template #activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                icon="mdi-delete"
                color="secondary"
                variant="text"
                flat
              />
            </template>
          </commons-confirm-dialog>
        </template>
      </v-data-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { VDataTable } from 'vuetify/components'

import { useExpensesStore } from '@/stores/cruds/expenses'
import { useDisplay } from 'vuetify'

definePageMeta({
  middleware: 'authenticated',
})

const vuetifyDisplay = useDisplay()

const expensesStore = useExpensesStore()
const messageStore = useMessagesStore()
const achievementsStore = useAchievementsStore()

const formRules = useRules()

const createExpenseForm = useTemplateRef('createExpenseForm')
const valueFieldIsFocused = ref(false)
const typeFieldIsFocused = ref(false)

type ReadonlyHeaders = VDataTable['$props']['headers']

const createExpenseFormIsValid = ref(false)

const createExpenseFormPayload = ref({
  value: 0,
  type: undefined,
})

const selectedMode = ref<'expense' | 'income'>('expense')

const expenseTableHeaders: ReadonlyHeaders = [
  {
    key: 'type',
    title: 'Tipo',
    align: 'start',
  },
  {
    key: 'value',
    title: 'Valor',
    align: 'start',
  },
  {
    key: 'createdAt',
    title: 'Data',
    align: 'start',
  },
  {
    key: 'actions',
    title: 'Ações',
    align: 'center',
    sortable: false,
  },
]

async function handleCreateExpense() {
  const validationResult = await createExpenseForm.value?.validate()

  if (validationResult?.valid) {
    await expensesStore.create({
      value: selectedMode.value === 'expense' ? createExpenseFormPayload.value.value * -1 : createExpenseFormPayload.value.value,
      type: createExpenseFormPayload.value.type ?? '',
      currency: expensesStore.selectedCurrency,
      expenseDate: getCurrentUnixTime(),
      name: '',
    })

    if (createExpenseFormPayload.value.type === 'Doação' && createExpenseFormPayload.value.value < 0) {
      await achievementsStore.completeAchievement('loving')
    }

    createExpenseFormPayload.value = {
      value: 0,
      type: undefined,
    }
  } else {
    messageStore.showErrorMessage({ text: 'Dados inválidos!' })
  }
}
</script>

<style lang="scss">
.giantInput {
  border-radius: 300px;
  overflow: hidden;

  height: 70px;
  min-width: 400px;

  * {
    font-size: 2rem !important;
  }

  &.isFocused {
    outline: 3px solid rgb(var(--v-theme-secondary));
  }
}

.expensesTable {
  *:not(i) {
    font-size: 1rem;
  }

  tr {
    height: 70px;

    &:nth-child(2n) {
      background-color: rgb(var(--v-theme-container));
    }

    td {
      border-bottom: 0 !important;
    }
  }
}

@media(max-width: 960px) {
  .giantInput {
    min-width: auto;

    width: 100%;
  }
}
</style>
