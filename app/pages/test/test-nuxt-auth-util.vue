<script setup>
const { loggedIn, user, session, clear, openInPopup } = useUserSession()
</script>

<template>
  <div v-if="loggedIn">
    <h1>Welcome {{ user.login }}!</h1>
    <p>Logged in since {{ session.loggedInAt }}</p>
    <button @click="clear">Logout</button>
  </div>
  <div v-else>
    <h1>Not logged in</h1>
    <a href="/api/auth/google">Login with Google</a>
    <!-- or open the OAuth route in a popup -->
    <button @click="openInPopup('/api/auth/google')">Login with Google</button>
  </div>
</template>