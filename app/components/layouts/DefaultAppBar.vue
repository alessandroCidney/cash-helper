<template>
  <v-app-bar
    :elevation="0"
    :height="72"

    color="root"
  >
    <template
      v-if="vuetifyDisplay.mdAndDown.value"
      #prepend
    >
      <commons-app-logo
        :width="190"
        class="mx-4"
      />
    </template>

    <template #append>
      <div class="notificationsArea">
        <v-menu
          :model-value="notificationsStore.menuIsOpen"
          max-height="500px"
          max-width="600px"
          location="left"
          @update:model-value="notificationsStore.setMenuIsOpen"
        >
          <template #activator="{ props }">
            <v-btn
              color="neutral"
              icon="mdi-bell-outline"
              variant="tonal"
              v-bind="props"
            >
              <v-badge
                :model-value="notificationsStore.unreadNotifications.length > 0"
                :content="notificationsStore.unreadNotifications.length"
                color="primary"
              >
                <v-icon>
                  mdi-bell-outline
                </v-icon>
              </v-badge>
            </v-btn>
          </template>

          <v-card class="pb-2">
            <template #title>
              Notificações
            </template>

            <template #text>
              <v-list
                v-if="notificationsStore.items.length"
                class="py-0 notificationsList"
              >
                <v-list-item
                  v-for="(notificationsData, notificationIndex) in notificationsStore.items"
                  :key="`notificationIndex${notificationIndex}`"
                  :to="notificationsData.to"
                  :active="false"
                  class="py-4"
                >
                  <template #prepend>
                    <v-icon>
                      {{ notificationsData.icon }}
                    </v-icon>
                  </template>

                  <template #title>
                    {{ notificationsData.text }}
                  </template>
                </v-list-item>
              </v-list>

              <div
                v-else
                class="text-center"
              >
                Nenhuma notificação até o momento.
              </div>
            </template>
          </v-card>
        </v-menu>
      </div>

      <div
        v-if="authStore.authUser && authStore.databaseUser"
        class="userAvatarCard px-4 d-flex align-center justify-center ga-2"
      >
        <v-menu
          :disabled="loadingUpdateProfilePhoto"
          max-height="500px"
          max-width="500px"
          location="bottom"
          content-class="changeAvatarMenu"
        >
          <template #activator="{ props }">
            <commons-user-avatar
              size="45"
              :loading="loadingUpdateProfilePhoto"
              v-bind="props"
            />
          </template>

          <v-card>
            <template #title>
              Mudar avatar
            </template>

            <template #text>
              <div
                class="changeAvatarMenuList"
                role="list"
              >
                <div
                  v-for="(iconData, iconIndex) in iconAvatarsList.filter(item => item.value !== authStore.databaseUser?.profilePhoto?.value)"
                  :key="`iconIndex${iconIndex}`"
                  role="listitem"
                >
                  <v-btn
                    color="line"
                    variant="tonal"
                    size="80"
                    icon
                    flat
                    @click="updateProfilePhoto(iconData)"
                  >
                    <v-icon
                      size="50"
                      color="text"
                    >
                      {{ iconData.value }}
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
          </v-card>
        </v-menu>

        <div v-if="vuetifyDisplay.mdAndUp.value">
          <div class="font-weight-medium userDisplayNameText">
            {{ authStore.databaseUser.name }}
          </div>

          <div class="text-medium-emphasis userEmailText">
            {{ authStore.authUser.email }}
          </div>
        </div>
      </div>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const messagesStore = useMessagesStore()

const usersCrud = useUsersCrud()

const vuetifyDisplay = useDisplay()

const loadingUpdateProfilePhoto = ref(false)

async function updateProfilePhoto(iconData: ArrayElementType<typeof iconAvatarsList>) {
  try {
    loadingUpdateProfilePhoto.value = true

    if (!authStore.databaseUser) {
      throw new Error('Unauthenticated')
    }

    const updatedUser = await usersCrud.update({
      ...authStore.databaseUser,

      profilePhoto: iconData,
    })

    authStore.setDatabaseUser(updatedUser as DatabaseUser)

    messagesStore.showSuccessMessage({
      text: 'Avatar atualizado com sucesso!',
    })
  } catch (err) {
    globalErrorHandler(err)
  } finally {
    loadingUpdateProfilePhoto.value = false
  }
}
</script>

<style lang="scss" scoped>
.userAvatarCard {
  .userEmailText {
    font-size: .9rem;
  }
}
</style>

<style lang="scss">
.notificationsList {
  .v-list-item {
    .v-list-item__spacer {
      width: 20px !important;
    }
  }
}

.changeAvatarMenu {
  .changeAvatarMenuList {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 10px;

    > div {
      width: calc(25% - (3 * 10px));

      text-align: center;
    }
  }
}
</style>
