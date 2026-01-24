<template>
  <v-app>
    <v-app-bar
      :elevation="0"
      :height="72"
      absolute
    >
      <template #prepend>
        <commons-app-logo
          :width="170"
          class="mx-4"
        />
      </template>

      <template #append>
        <v-btn
          :loading="authStore.loadingSignOut"
          prepend-icon="mdi-arrow-left"
          variant="tonal"
          class="mr-3"
          rounded
          @click="authStore.handleSignOut()"
        >
          Sair
        </v-btn>
      </template>
    </v-app-bar>

    <v-main class="pt-0">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script>
