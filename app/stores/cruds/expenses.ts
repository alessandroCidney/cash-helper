import { limit, orderBy, startAfter, where } from 'firebase/firestore'

import _ from 'lodash'

import { DEFAULT_ITEMS_PER_PAGE } from '~/utils/pagination'

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    items: [] as DatabaseExpense[],

    nextPageExists: undefined as boolean | undefined,

    loadingList: false,
    loadedOnce: false,

    loadingCreate: false,
    loadingUpdate: false,
    loadingRemove: false,

    selectedCurrency: 'R$',
  }),

  actions: {
    async list() {
      try {
        this.loadingList = true

        const expensesCrud = useExpensesCrud()

        const sevenDaysAgoDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)

        sevenDaysAgoDate.setHours(0, 0, 0, 0)

        const sevenDaysAgoUnixTimestamp = dateToUnixTimestamp(sevenDaysAgoDate)

        let newItems = await expensesCrud.list([
          orderBy('expenseDate', 'desc'),
          where('expenseDate', '>=', sevenDaysAgoUnixTimestamp),
        ])

        if (newItems.length === 0) {
          // There are no recent items

          newItems = await expensesCrud.list([
            orderBy('expenseDate', 'desc'),
            limit(DEFAULT_ITEMS_PER_PAGE + 1),
          ])

          this.checkIfNextPageExists(newItems, DEFAULT_ITEMS_PER_PAGE + 1)

          this.items = newItems
        } else {
          this.items = newItems

          await this.completeLastPage()
        }

        this.items = newItems

        this.loadedOnce = true
      } catch (err) {
        globalErrorHandler(err)
      } finally {
        this.loadingList = false
      }
    },

    checkIfNextPageExists(newItems: unknown[], expectedQuantity: number) {
      if (newItems.length === expectedQuantity) {
        this.nextPageExists = true

        newItems.pop()
      } else {
        this.nextPageExists = false
      }
    },

    async completeLastPage() {
      const expensesCrud = useExpensesCrud()

      const paginationData = getPaginationData(this.items)

      if (this.items.length === 0) {
        return
      }

      const newItems = await expensesCrud.list([
        orderBy('expenseDate', 'desc'),
        startAfter(this.items[this.items.length - 1]?.expenseDate),
        limit(paginationData.quantityToCompleteLastPage + 1),
      ])

      this.checkIfNextPageExists(newItems, paginationData.quantityToCompleteLastPage + 1)

      this.items.push(...newItems)
    },

    async getNextPage() {
      await this.completeLastPage()

      const expensesCrud = useExpensesCrud()

      if (this.items.length === 0) {
        return
      }

      if (this.nextPageExists) {
        const newItems = await expensesCrud.list([
          orderBy('expenseDate', 'desc'),
          startAfter(this.items[this.items.length - 1]?.expenseDate),
          limit(DEFAULT_ITEMS_PER_PAGE + 1),
        ])

        this.checkIfNextPageExists(newItems, DEFAULT_ITEMS_PER_PAGE + 1)

        this.items.push(...newItems)
      }
    },

    async create(...rest: Parameters<Awaited<ReturnType<typeof useExpensesCrud>>['create']>) {
      try {
        this.loadingCreate = true

        const expensesCrud = useExpensesCrud()

        const itemObj = await expensesCrud.create(...rest)

        this.items.unshift(itemObj)

        await this.completeLastPage()

        const messageStore = useMessagesStore()
        messageStore.showSuccessMessage({ text: 'Registro adicionado!' })

        return itemObj
      } catch (err) {
        globalErrorHandler(err)
      } finally {
        this.loadingCreate = false
      }
    },

    async update(data: DatabaseExpense) {
      try {
        this.loadingUpdate = true

        const expensesCrud = useExpensesCrud()

        const itemObj = await expensesCrud.update(data)

        const itemIndex = this.items.findIndex(item => item.id === itemObj.id)

        const oldItem = this.items[itemIndex]

        if (oldItem) {
          const haveADateUpdate = oldItem.expenseDate !== itemObj.expenseDate

          this.items[itemIndex] = {
            ...data,
            ...itemObj,
          }

          if (haveADateUpdate) {
            this.items = _.orderBy(this.items, ['expenseDate'], ['desc'])

            const newItemIndex = this.items.findIndex(item => item.id === itemObj.id)

            if (newItemIndex === this.items.length - 1) {
              // The item has been moved to the end of the list.
              // An unloaded item may be in a position before it.

              this.items.pop()

              await this.completeLastPage()
            }
          }
        }

        const messageStore = useMessagesStore()
        messageStore.showSuccessMessage({ text: 'Registro atualizado!' })

        return itemObj
      } catch (err) {
        globalErrorHandler(err)
      } finally {
        this.loadingUpdate = false
      }
    },

    async remove(id: string) {
      try {
        const expensesCrud = useExpensesCrud()

        await expensesCrud.remove(id)

        const itemIndex = this.items.findIndex(item => item.id === id)

        this.items.splice(itemIndex, 1)

        await this.completeLastPage()

        const messageStore = useMessagesStore()
        messageStore.showSuccessMessage({ text: 'Registro removido!' })
      } catch (err) {
        globalErrorHandler(err)
      }
    },
  },
})
