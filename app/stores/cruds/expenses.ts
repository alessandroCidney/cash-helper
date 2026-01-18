import { limit, orderBy, startAfter, where } from 'firebase/firestore'

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

        this.items = await expensesCrud.list([
          orderBy('expenseDate', 'desc'),
          where('expenseDate', '>=', sevenDaysAgoUnixTimestamp),
        ])

        await this.completeLastPage()

        this.loadedOnce = true
      } catch (err) {
        globalErrorHandler(err)
      } finally {
        this.loadingList = false
      }
    },

    async completeLastPage() {
      const expensesCrud = useExpensesCrud()

      const paginationData = getPaginationData(this.items)

      if (!paginationData.lastPageIsFull) {
        const newItems = await expensesCrud.list([
          orderBy('expenseDate', 'desc'),
          startAfter(this.items[this.items.length - 1]?.expenseDate),
          limit(paginationData.quantityToCompleteLastPage + 1),
        ])

        if (newItems.length === paginationData.quantityToCompleteLastPage + 1) {
          this.nextPageExists = true

          newItems.pop()
        }

        this.items.push(...newItems)
      }
    },

    async getNextPage() {
      await this.completeLastPage()

      const expensesCrud = useExpensesCrud()

      const paginationData = getPaginationData(this.items)

      if (this.nextPageExists) {
        const newItems = await expensesCrud.list([
          orderBy('expenseDate', 'desc'),
          startAfter(this.items[this.items.length - 1]?.expenseDate),
          limit(paginationData.itemsPerPage),
        ])

        this.items.push(...newItems)
      }
    },

    async create(...rest: Parameters<Awaited<ReturnType<typeof useExpensesCrud>>['create']>) {
      try {
        this.loadingCreate = true

        const expensesCrud = useExpensesCrud()

        const itemObj = await expensesCrud.create(...rest)

        this.items.unshift(itemObj)

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

        if (itemIndex !== -1) {
          this.items[itemIndex] = {
            ...data,
            ...itemObj,
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

        const messageStore = useMessagesStore()
        messageStore.showSuccessMessage({ text: 'Registro removido!' })
      } catch (err) {
        globalErrorHandler(err)
      }
    },
  },
})
