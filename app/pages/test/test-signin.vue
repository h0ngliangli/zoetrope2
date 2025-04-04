<script setup lang="ts">
import {
  GoogleSignInButton,
  type CredentialResponse,
  decodeCredential,
} from "vue3-google-signin"

const btnGoogleSignIn = ref(null)
// handle success event
const handleLoginSuccess = (response: CredentialResponse) => {
  const { credential } = response
  console.log("Access Token", credential)
}

// handle an error event
const handleLoginError = () => {
  console.error("Login failed")
}

// decode token
const token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM3ZTA0NDY1NjQ5ZmZhNjA2NTU3NjUwYzdlNjVmMGE4N2FlMDBmZTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0ODg4OTEyMzAwMDAtaTJiYzZpYmtndWcxZ2Q3dnUwN3VrcG1wNWluNDFwcjkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0ODg4OTEyMzAwMDAtaTJiYzZpYmtndWcxZ2Q3dnUwN3VrcG1wNWluNDFwcjkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE3MjkxODM4MzQyMDY0NzkxNjkiLCJlbWFpbCI6Indvb2R5bGk4MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzQzNzUxMzE1LCJuYW1lIjoiSG9uZ2xpYW5nIExpIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xDNzBvOXJxdFBhbGc0T3Ezc3BJNnB2Qk9uRERJendVbVBZQzhsak5jS3RzaXJJWGxmNWc9czk2LWMiLCJnaXZlbl9uYW1lIjoiSG9uZ2xpYW5nIiwiZmFtaWx5X25hbWUiOiJMaSIsImlhdCI6MTc0Mzc1MTYxNSwiZXhwIjoxNzQzNzU1MjE1LCJqdGkiOiJkOTMzMThjZTU0NWQyZDg2ZmM2YWQ4ODU2ZjMwODc3MTI5ZTIwM2FhIn0.kJ3vth7V3nPBVPt9Ld8ibzofPel53NxMMYjC4L52DfOy4E-f_BU3C0mnp_cs0RL1r8AV8wLIjBWuQCSYCnTsS3hFJ4bOPsBy39hKZLyrAXWt_DHuvLYzejseUULySn7kcUo2x-5mScGuzqdfrogxbZqzzBXW2UnH65tN4cFwBOOIVgG-HkzoFtKSJjduTG00cIEKC81l9FKBToAnutJqn81Cgd-P-Yb2Q7MntJjJI_h15w7AcdHkAJqA9sm8wP_8rmyrL4a96LkcRrw_qoK45LbwXDiTlDl0f50hRS6-fNPWQ2Y156mPlAYDCi_aQSRXa4ZeFDQ4Xu6GKuLNJg6jBQ"
const decoded = decodeCredential(token)
console.log("Decoded Token", decoded)
</script>

<template>
  <div>
    <GoogleSignInButton
      ref="btnGoogleSignIn"
      theme="filled_blue"
      size="medium"
      text="signup_with"
      shape="pill"
      locale="zh_CN"
      @success="handleLoginSuccess"
      @error="handleLoginError"
    />
    <!-- <UButton label="Google登陆" @click="clickGoogleSignIn"> </UButton>
     -->

  </div>
</template>
