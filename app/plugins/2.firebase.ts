import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: runtimeConfig.public.API_KEY,
    authDomain: runtimeConfig.public.AUTH_DOMAIN,
    projectId: runtimeConfig.public.PROJECT_ID,
    storageBucket: runtimeConfig.public.STORAGE_BUCKET,
    messagingSenderId: runtimeConfig.public.MESSAGING_SENDER_ID,
    appId: runtimeConfig.public.APP_ID,
    measurementId: runtimeConfig.public.MEASUREMENT_ID,
  }

  const firebaseApp = initializeApp(firebaseConfig)
  const firebaseFirestore = getFirestore(firebaseApp)
  const firebaseAuth = getAuth()

  return {
    provide: {
      firebaseApp,
      firebaseFirestore,
      firebaseAuth,
    },
  }
})
