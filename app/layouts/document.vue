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
          prepend-icon="mdi-arrow-left"
          variant="tonal"
          class="mr-3"
          rounded
          @click="router.back()"
        >
          Voltar
        </v-btn>
      </template>
    </v-app-bar>

    <v-main class="applicationDocumentsPage">
      <v-tabs tag="nav">
        <v-tab :to="{ name: 'documents-terms-of-use' }">
          Termos de uso
        </v-tab>

        <v-tab :to="{ name: 'documents-privacy-policy' }">
          Política de privacidade
        </v-tab>
      </v-tabs>

      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const router = useRouter()
</script>

<style lang="scss">
.applicationDocumentsPage {
  h1, h2 {
    margin-bottom: 10px;
  }

  p, li {
    margin-bottom: 20px;
  }

  section {
    margin-top: 50px;
  }

  li {
    transform: translateX(20px);
  }
}
</style>
