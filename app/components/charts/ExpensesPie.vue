<template>
  <div
    v-if="isEmpty"
    class="flex-fill d-flex align-center justify-center w-100"
  >
    <commons-warning-screen
      description="As entradas e saídas aparecem aqui."
    >
      <template #title>
        <h3>
          Nenhum registro adicionado
        </h3>
      </template>

      <template #image>
        <commons-theme-image
          :aspect-ratio="1"
          base-path="/images/illustrations"
          filename="pie-chart.svg"
          class="mx-auto"
          min-width="200px"
          width="200px"
        />
      </template>
    </commons-warning-screen>
  </div>

  <v-chart
    v-else
    :option="option"
    class="chart"
    autoresize
  />
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, type PieSeriesOption } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

import { useTheme } from 'vuetify'

import _ from 'lodash'

import { useExpensesStore } from '@/stores/cruds/expenses'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

const expensesStore = useExpensesStore()

defineProps({
  height: { type: String, required: true },
})

const lastSevenDaysExpenses = computed(() => filterByTheLastSevenDays(expensesStore.items, 'expenseDate'))

const isEmpty = computed(() => lastSevenDaysExpenses.value.length === 0)

const chartData = computed(() => {
  const summary = {
    positive: 0,
    negative: 0,
  }

  for (const expenseData of lastSevenDaysExpenses.value) {
    if (expenseData.value > 0) {
      summary.positive += expenseData.value
    } else {
      summary.negative += Math.abs(expenseData.value)
    }
  }

  return summary
})

const vuetifyTheme = useTheme()

const optionData = computed(() => ({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: '5%',
    left: 'center',

    textStyle: {
      fontFamily: 'Roboto',

      color: vuetifyTheme.current.value.colors.neutral,
    },
  },
  series: [
    {
      name: 'Entradas e Saídas',
      color: [vuetifyTheme.current.value.colors.primary, vuetifyTheme.current.value.colors.secondary],
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10,
      },
      label: {
        show: false,
        position: 'center',
      },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: chartData.value.positive,
          name: 'Entradas',
        },
        {
          value: chartData.value.negative,
          name: 'Saídas',
        },
      ],
    },
  ] as PieSeriesOption,
}))

const option = ref(optionData.value)
</script>

<style scoped lang="scss">
.chart {
  height: v-bind(height);
  width: 100%;
}
</style>
