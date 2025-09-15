<template>
  <div class="page">
    <h2>Connect</h2>
    <div class="flex w-full flex-col items-center">
      <div class="flex max-w-md min-w-md">
        <button @click="tab = 'login'" :disabled="tab === 'login'">Login</button>
        <button @click="tab = 'register'" :disabled="tab === 'register'">Register</button>
      </div>
      <div v-if="tab === 'login'" class="max-w-md min-w-md">
        <form @submit.prevent="handleSignIn">
          <input v-model="email" type="email" placeholder="Email" required />
          <div class="relative flex w-full items-center">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" required />
            <span @click="showPassword = !showPassword" class="absolute right-[8px] cursor-pointer">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="#222" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" stroke="#222" stroke-width="2" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#222" stroke-width="2" d="M3 3l18 18M1 12s4-7 11-7c2.5 0 4.7.7 6.5 1.8M21 21c-1.8 1.1-4 1.8-6.5 1.8-7 0-11-7-11-7a21.6 21.6 0 0 1 5.1-5.7" /></svg>
            </span>
          </div>
          <button type="submit">Login</button>
          <p>--- or continue with ---</p>
          <div class="flex w-full">
            <button @click="handleGoogle" type="button">Google</button>
            <button @click="handleEvm" type="button">EVM Wallet</button>
          </div>
        </form>
      </div>
      <div v-else class="max-w-md min-w-md">
        <form @submit.prevent="handleSignUp">
          <input v-model="newEmail" type="email" placeholder="Email" required />
          <div class="relative flex w-full items-center">
            <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" placeholder="Password" required />
            <span @click="showNewPassword = !showNewPassword" class="absolute right-[8px] cursor-pointer">
              <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="#222" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" stroke="#222" stroke-width="2" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#222" stroke-width="2" d="M3 3l18 18M1 12s4-7 11-7c2.5 0 4.7.7 6.5 1.8M21 21c-1.8 1.1-4 1.8-6.5 1.8-7 0-11-7-11-7a21.6 21.6 0 0 1 5.1-5.7" /></svg>
            </span>
          </div>
          <button type="submit">Register</button>
          <p>--- or continue with ---</p>
          <div class="flex w-full">
            <button @click="handleGoogle" type="button">Google</button>
            <button @click="handleEvm" type="button">EVM Wallet</button>
          </div>
        </form>
      </div>
    </div>
    <Toast :message="error" :show="showToast" />
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../main";
import { useUserStore } from "../stores/user";
import Toast from "../components/Toast.vue";

const router = useRouter();
const userStore = useUserStore();
const tab = ref("login");
const email = ref("");
const password = ref("");
const newEmail = ref("");
const newPassword = ref("");
const error = ref("");
const showPassword = ref(false);
const showNewPassword = ref(false);
const showToast = ref(false);

watch(error, (val) => {
  if (val) {
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      error.value = "";
    }, 3000);
  }
});

async function handleSignIn() {
  error.value = "";
  const { error: err } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value });
  if (err) {
    if (
      err.message &&
      (err.message.includes('Invalid login credentials') || err.message.includes('Email not confirmed'))
    ) {
      // Call backend API to check if user exists and is a social login
      try {
        const res = await fetch('https://wild-dragons.vercel.app/api/check-user?email=' + encodeURIComponent(email.value));
        if (res.ok) {
          const { user } = await res.json();
          console.log('user check', user);
          
          if (user && user.app_metadata && user.app_metadata.providers && user.app_metadata.providers.includes('google')) {
            error.value = 'Account found but has no password set. Please use Google to Login and set your password on Settings page or use Forgot Password feature.';
            return;
          }
        }
      } catch (e) {
        // Ignore API errors, fallback to default error
      }
    }
    error.value = err.message;
    return;
  }
  await userStore.fetchUser();
  router.push('/game');
}

async function handleSignUp() {
  error.value = "";
  const { error: err } = await supabase.auth.signUp({ email: newEmail.value, password: newPassword.value });
  if (err) {
    error.value = err.message;
    return;
  }
  await userStore.fetchUser();
  router.push("/game");
}

async function handleGoogle() {
  error.value = "";
  const { error: err, data } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/game" } });
  if (err) {
    error.value = err.message;
    return;
  }
}

async function handleEvm() {
  error.value = "";
  error.value = "EVM wallet login is not implemented yet.";
}
</script>
