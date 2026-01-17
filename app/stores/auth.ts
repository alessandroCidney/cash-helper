import { deleteUser, getAuth, signOut, type User } from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    databaseUser: null as DatabaseUser | null,
    privateProfileData: null as DatabaseUserPrivateData | null,
    authUser: null as User | null,

    loadingAuth: true,
    loadingSignOut: false,
    loadingDeleteFirebaseAccount: false,
  }),

  getters: {
    acceptedAllDocuments(state) {
      return !!state.privateProfileData
        && Object
          .values(state.privateProfileData.documents)
          .every(documentData => documentData.accepted)
    },

    isAuthenticated(state): boolean {
      return !!state.databaseUser?.active && !state.databaseUser.deleted && !!state.authUser // && this.acceptedAllDocuments
    },

    emailIsVerified(state) {
      return state.authUser?.emailVerified
    },

    incompleteProfile(state) {
      if (state.databaseUser) {
        return !state.databaseUser.name || !state.databaseUser.profilePhoto || !state.privateProfileData?.dateOfBirth
      }
    },

    validatedAuthUser(state) {
      if (!state.authUser) {
        throw new Error('Unauthenticated')
      }

      return state.authUser
    },

    userProfilePhoto(state) {
      const defaultProfilePhoto: DatabaseUser['profilePhoto'] = {
        type: 'icon',
        value: 'mdi-face-man',
      }

      return state.databaseUser?.profilePhoto ?? defaultProfilePhoto
    },
  },

  actions: {
    setAuthUser(data: typeof this.authUser) {
      this.authUser = data
    },

    setDatabaseUser(data: typeof this.databaseUser) {
      this.databaseUser = data
    },

    setPrivateProfileData(data: typeof this.privateProfileData) {
      this.privateProfileData = data
    },

    setLoadingAuth(data: typeof this.loadingAuth) {
      this.loadingAuth = data
    },

    async handleSignOut() {
      try {
        this.loadingSignOut = true

        const auth = getAuth()

        await signOut(auth)
      } catch (err) {
        globalErrorHandler(err)
      } finally {
        window.location.reload()

        this.loadingSignOut = false
      }
    },

    async handleDeleteFirebaseAccount() {
      try {
        this.loadingDeleteFirebaseAccount = true

        const auth = getAuth()

        if (auth.currentUser) {
          await deleteUser(auth.currentUser)
        }
      } catch (err) {
        globalErrorHandler(err)
      } finally {
        this.loadingDeleteFirebaseAccount = false
      }
    },
  },
})
