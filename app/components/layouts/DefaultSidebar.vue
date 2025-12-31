<template>
  <v-bottom-navigation
    v-if="vuetifyDisplay.smAndDown.value"
    :model-value="route.name"
    :height="70"
    grow
    @update:model-value="router.push({ name: $event })"
  >
    <v-btn
      v-for="routeData in routes"
      :key="routeData.title"
      :value="routeData.name"
    >
      <v-icon size="30">
        {{ routeData.icon }}
      </v-icon>

      <span>{{ routeData.title }}</span>
    </v-btn>
  </v-bottom-navigation>

  <v-navigation-drawer
    v-else
    v-model="sidebarsStore.defaultSidebarIsOpen"
    :rail="vuetifyDisplay.md.value"
    :rail-width="82"
    :mobile="false"
    color="root"
    :class="{
      'defaultSidebar': true,
      'pt-2': vuetifyDisplay.md.value,
    }"
    tag="div"
    floating
  >
    <div
      v-if="vuetifyDisplay.lgAndUp.value"
      class="logoArea d-flex align-center justify-start ga-2 px-5"
    >
      <commons-app-logo
        :width="190"
      />
    </div>

    <v-list
      class="sidebarList py-0"
      active-class="bg-secondary text-white"
      tag="nav"
    >
      <v-list-item
        v-for="routeData in routes"
        :key="routeData.title"
        :to="{ name: routeData.name }"
      >
        <template #prepend>
          <v-icon>
            {{ routeData.icon }}
          </v-icon>
        </template>

        <template #title>
          {{ routeData.title }}
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const sidebarsStore = useSidebarsStore()

const routes = getRoutes()

const route = useRoute()
const router = useRouter()

const vuetifyDisplay = useDisplay()
</script>

<style lang="scss">
.defaultSidebar {
  .logoArea {
    height: 80px;
  }

  .sidebarList {
    background-color: rgb(var(--v-theme-container)) !important;
    border-radius: 0 var(--ultra-rounded-border-radius) var(--ultra-rounded-border-radius) 0 !important;

    .v-list-item {
      height: 60px !important;

      padding-left: 26px !important;
    }
  }
}
</style>
