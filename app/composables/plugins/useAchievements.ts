import _ from 'lodash'

export function useAchievements() {
  async function loadAndCheckAchievements() {
    /* TODO: Review achievements with the new auth system */

    const authStore = useAuthStore()
    const achievementsStore = useAchievementsStore()
    const notificationsStore = useNotificationsStore()
    const usersCrud = useUsersCrud()

    if (!authStore.privateProfileData || !authStore.databaseUser) {
      return
    }

    function achievementCompletedBefore(achievementData: AchivementData) {
      return authStore.privateProfileData?.achievements.complete.find(item => item.id === achievementData.id)
    }

    function achievementStepsCompleted(achievementData: AchivementData) {
      return achievementData.currentStep === achievementData.totalSteps
    }

    function getCurrentStep(achievementData: AchivementData) {
      const loginSequenceCounter = authStore.privateProfileData?.achievements.inProgressPayload.loginSequenceCounter ?? 0

      return loginSequenceCounter > achievementData.totalSteps ? achievementData.totalSteps : loginSequenceCounter
    }

    const { preserveLoginSequence, incrementLoginSequence } = loginSequenceValidation(authStore.privateProfileData.achievements.inProgressPayload.lastLoginValidationTime)

    const updateData = {
      changed: false,

      newCompletedAchievements: [] as CompletedAchievementData[],
      newLoginSequenceCounter: authStore.privateProfileData.achievements.inProgressPayload.loginSequenceCounter,
    }

    for (const achievementData of achievementsStore.items) {
      if (achievementCompletedBefore(achievementData)) {
        achievementsStore.completeAchievementSteps(achievementData.id)
        continue
      }

      // Validations based on loginSequenceValidation
      if (achievementData.type === 'loginSequenceValidation') {
      // Loads the current step
        achievementsStore.setAchievementCurrentStep(
          achievementData.id,
          getCurrentStep(achievementData),
        )

        // If the user logged in yesterday and today, then this will increment the currentStep
        if (incrementLoginSequence && !achievementStepsCompleted(achievementData)) {
          achievementsStore.incrementAchievementSteps(achievementData.id)
        }

        // If the user didn't logged in yesterday and today, then this will reset the currentStep and loginSequenceCounter,
        if (!preserveLoginSequence) {
          achievementsStore.resetAchievementSteps(achievementData.id)

          updateData.changed = true
          updateData.newLoginSequenceCounter = 1
        }
      }

      // Checks achievements that have been completed but not yet saved
      if (achievementStepsCompleted(achievementData) && !achievementCompletedBefore(achievementData)) {
        updateData.changed = true

        updateData.newCompletedAchievements.push({
          id: achievementData.id,
          completedAt: getCurrentUnixTime(),
        })

        notificationsStore.addAchievementNotification(achievementData.id)
      }
    }

    // Profile counter should be incremented outside of for loop
    if (incrementLoginSequence) {
      updateData.changed = true
      updateData.newLoginSequenceCounter++
    }

    if (updateData.changed) {
      const newPrivateProfileData = _.cloneDeep(authStore.privateProfileData)

      newPrivateProfileData.achievements.inProgressPayload.lastLoginValidationTime = getCurrentUnixTime()

      newPrivateProfileData.achievements.inProgressPayload.loginSequenceCounter = updateData.newLoginSequenceCounter

      newPrivateProfileData.achievements.complete = [
        ...newPrivateProfileData.achievements.complete,
        ...updateData.newCompletedAchievements,
      ]

      await usersCrud.updatePrivateProfileData(authStore.databaseUser.id, newPrivateProfileData)
    }
  }

  function loginSequenceValidation(lastLoginValidationTime: number) {
    const lastLoginUnixTime = lastLoginValidationTime
    const lastLoginDate = unixTimestampToDate(lastLoginUnixTime)

    const currentUnixTime = getCurrentUnixTime()
    const currenDate = unixTimestampToDate(currentUnixTime)

    const isDifferenceLessThan24Hours = currentUnixTime - lastLoginUnixTime < 60 * 60 * 24
    const isSequenceDay = currenDate.getDate() === lastLoginDate.getDate() + 1
    const isSameDay = currenDate.getDate() === lastLoginDate.getDate()

    // Next day
    const incrementLoginSequence = isDifferenceLessThan24Hours && isSequenceDay

    // Same day or already validated
    const preserveLoginSequence = isDifferenceLessThan24Hours && (isSameDay || isSequenceDay)

    // User has not been logged in for a long time
    const resetLoginSequence = !incrementLoginSequence && !preserveLoginSequence

    return {
      incrementLoginSequence,
      preserveLoginSequence,
      resetLoginSequence,
    }
  }

  return {
    loadAndCheckAchievements,
  }
}
