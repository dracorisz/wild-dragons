<template>
  <div class="page">
    <h2>Connect</h2>
    <div class="flex w-full flex-col items-center">
      <div class="flex max-w-md min-w-md">
        <button @click="tab = 'login'">Login</button>
        <button @click="tab = 'register'">Register</button>
      </div>
      <div v-if="tab === 'login'" class="max-w-md min-w-md">
        <form @submit.prevent="handleSignIn">
          <input v-model="email" type="email" placeholder="Email" required />
          <div class="relative flex w-full items-center">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" required autocomplete="current-password" />
            <span @click="showPassword = !showPassword" class="absolute right-[8px] cursor-pointer">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="#222" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" stroke="#222" stroke-width="2" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#222" stroke-width="2" d="M3 3l18 18M1 12s4-7 11-7c2.5 0 4.7.7 6.5 1.8M21 21c-1.8 1.1-4 1.8-6.5 1.8-7 0-11-7-11-7a21.6 21.6 0 0 1 5.1-5.7" /></svg>
            </span>
          </div>
          <button type="submit" :disabled="!email || !isValidEmail(email) || !password || email.length === 0 || password.length === 0">Login</button>
        </form>
      </div>
      <div v-else class="max-w-md min-w-md">
        <form @submit.prevent="handleSignUp">
          <input v-model="newEmail" type="email" placeholder="Email" required />
          <div class="relative flex w-full items-center">
            <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" placeholder="Password" required autocomplete="current-password" @input="validatePassword" />
            <span @click="showNewPassword = !showNewPassword" class="absolute right-[8px] cursor-pointer">
              <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="#222" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" stroke="#222" stroke-width="2" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#222" stroke-width="2" d="M3 3l18 18M1 12s4-7 11-7c2.5 0 4.7.7 6.5 1.8M21 21c-1.8 1.1-4 1.8-6.5 1.8-7 0-11-7-11-7a21.6 21.6 0 0 1 5.1-5.7" /></svg>
            </span>
          </div>
          <ul class="password-helper">
            <li :class="{ valid: passwordCriteria.minLength }">Minimum 8 characters</li>
            <li :class="{ valid: passwordCriteria.lowercase }">At least 1 lowercase letter</li>
            <li :class="{ valid: passwordCriteria.uppercase }">At least 1 uppercase letter</li>
            <li :class="{ valid: passwordCriteria.digit }">At least 1 digit</li>
            <li :class="{ valid: passwordCriteria.specialChar }">At least 1 special character</li>
          </ul>
          <button type="submit" :disabled="!isRegisterFormValid || !isValidEmail(newEmail)">Register</button>
        </form>
      </div>
      <div class="flex w-full max-w-md flex-col">
        <div class="mt-3 mb-8 flex h-px w-full items-center justify-center bg-gray-300">
          <span class="mb-1 bg-white px-3">or continue with</span>
        </div>

        <div class="flex w-full gap-2">
          <button @click="handleGoogle" type="button" class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30" fill="#fff">
              <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"></path>
            </svg>
            <span class="ml-2">Google</span>
          </button>
          <button @click="handleEvm" type="button" class="flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 14H16.51M3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9C21 7.89543 20.1046 7 19 7L5 7C3.89543 7 3 6.10457 3 5ZM3 5C3 3.89543 3.89543 3 5 3H17M17 14C17 14.2761 16.7761 14.5 16.5 14.5C16.2239 14.5 16 14.2761 16 14C16 13.7239 16.2239 13.5 16.5 13.5C16.7761 13.5 17 13.7239 17 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ml-2">EVM Wallet</span>
          </button>
        </div>
      </div>
    </div>
    <Toast :message="error" :show="showToast" />
  </div>
</template>
<script setup>
import { ref, watch, computed } from "vue";
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

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const passwordCriteria = ref({
  minLength: false,
  lowercase: false,
  uppercase: false,
  digit: false,
  specialChar: false,
});

const isRegisterFormValid = computed(() => {
  return newEmail.value && Object.values(passwordCriteria.value).every((criterion) => criterion);
});

const isLoginFormValid = computed(() => {
  return email.value && password.value;
});

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
  try {
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value });
    if (err) {
      error.value = err.message + ".";
      return;
    }
    await userStore.fetchUser();
    router.push("/game");
  } catch (e) {}
}

async function handleSignUp() {
  error.value = "";
  const { error: err } = await supabase.auth.signUp({ email: newEmail.value, password: newPassword.value });
  if (err) {
    if (err.message && err.message.toLowerCase().includes("already registered")) {
      error.value = "An account with this email already exists.";
      return;
    }
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

function validatePassword() {
  const password = newPassword.value;
  passwordCriteria.value.minLength = password.length >= 8;
  passwordCriteria.value.lowercase = /[a-z]/.test(password);
  passwordCriteria.value.uppercase = /[A-Z]/.test(password);
  passwordCriteria.value.digit = /\d/.test(password);
  passwordCriteria.value.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
}
</script>

<style scoped>
.password-helper {
  list-style: none;
  padding: 0;
  text-align: left;
  margin: 0.15rem 0 0.5rem 0;
  align-self: flex-start;
}
.password-helper li {
  font-size: 0.875rem;
  color: #aaaeae;
}
.password-helper li.valid {
  color: #22a311;
}
</style>
