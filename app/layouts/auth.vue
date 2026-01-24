<template>
  <v-app>
    <v-main>
      <div class="d-flex loginPageContainer">
        <div
          class="d-md-block d-none w-md-50 h-100"
        >
          <div
            class="w-100 h-100 ultraRounded overflow-hidden"
            :style="{
              backgroundImage: `url(${chartsAndCalcsImagePath})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }"
          />
        </div>

        <div
          class="w-md-50 w-100 h-100 loginPageContentContainer"
        >
          <div class="h-100 mx-auto loginPageContentContainer">
            <slot />
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import chartsAndCalcsImagePath from '@/assets/images/illustrations/tinified-charts-and-calcs.png'
</script>

<style lang="scss">
.loginPageContainer {
  height: 100dvh;
  padding: 1%;

  h1 {
    font-size: 3.5rem;

    line-height: 1;
  }

  .loginPageContentContainer {
    max-width: 80%;
  }
}

@media(max-width: 550px) {
  .loginPageContainer {
    h1 {
      font-size: 3rem;
    }
  }
}

// Vuetify md breakpoint start -> 960px
@media(max-width: 960px) {
  .loginPageContainer {
    .loginPageContentContainer {
      max-width: 100%;
    }
  }
}
</style>
