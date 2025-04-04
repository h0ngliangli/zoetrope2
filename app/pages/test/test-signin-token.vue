<script setup lang="ts">
import {
  useTokenClient,
  type AuthCodeFlowSuccessResponse,
  type AuthCodeFlowErrorResponse,
  decodeCredential,
} from "vue3-google-signin"

const handleOnSuccess = (response: AuthCodeFlowSuccessResponse) => {
  console.log("response: ", response)
  console.log("Access Token2: ", response.access_token)
  const decoded = decodeCredential(response.access_token)
  console.log("Decoded Token: ", decoded)
}

const handleOnError = (errorResponse: AuthCodeFlowErrorResponse) => {
  console.log("Error: ", errorResponse)
}

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  // other options
})
</script>

<template>
  <UButton label="Google登陆" :disabled="!isReady" @click="() => login()" />

  <!-- <button :disabled="!isReady" @click="() => login()">Login with Google</button> -->
</template>
