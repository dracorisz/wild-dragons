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
          <input v-model="email" type="email" placeholder="Email" autocomplete="email" />
          <div class="relative flex w-full items-center">
            <!-- Password input -->
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" autocomplete="current-password" />
            <!-- Forgot password SVG icon -->
            <span @click="showForgot = true" class="absolute right-10 flex cursor-pointer items-center" title="Forgot Password?">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#333" viewBox="0 0 16 16">
                <path d="M8 .5A7.77 7.77 0 0 0 0 8a7.77 7.77 0 0 0 8 7.5A7.77 7.77 0 0 0 16 8 7.77 7.77 0 0 0 8 .5zm0 13.75A6.52 6.52 0 0 1 1.25 8 6.52 6.52 0 0 1 8 1.75 6.52 6.52 0 0 1 14.75 8 6.52 6.52 0 0 1 8 14.25z" />
                <circle cx="7.98" cy="10.95" r=".76" />
                <path d="M9.73 4.75A2.72 2.72 0 0 0 8 4.19a2.28 2.28 0 0 0-2.41 2.17v.11h1.24v-.1A1.12 1.12 0 0 1 8 5.33a1 1 0 0 1 1.12 1c0 .35-.24.73-.78 1.11a2 2 0 0 0-1 1.46v.36h1.24V9a.76.76 0 0 1 .23-.51A3.92 3.92 0 0 1 9.33 8l.17-.14a2 2 0 0 0 .91-1.67 1.85 1.85 0 0 0-.68-1.44z" />
              </svg>
            </span>
            <!-- Password visibility icon -->
            <span @click="showPassword = !showPassword" class="absolute right-3 flex cursor-pointer items-center">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#333" viewBox="0 0 297 297">
                <path
                  d="M294.943,150.859c-2.787-4.447-15.897-24.469-38.049-44.607c-32.998-29.998-70.482-45.855-108.402-45.855
	c-37.921,0-75.406,15.857-108.407,45.855C15.501,128.6,2.045,150.813,1.483,151.746c-0.046,0.076-0.067,0.133-0.108,0.207
	c-2.043,3.58-1.811,8.084,0.712,11.447c0.567,0.756,14.168,18.721,38.88,36.691c32.841,23.887,70.02,36.512,107.52,36.512
	s74.681-12.625,107.523-36.51c24.712-17.973,38.315-35.938,38.882-36.693C297.686,159.676,297.702,154.557,294.943,150.859z
	 M242.386,121.33c12.041,10.881,21.241,21.871,27.209,29.758c-4.657,0.818-10.574,1.461-17.688,1.461
	c-24.835,0-52.252-7.412-81.488-22.029c-27.013-13.508-53.199-20.355-77.83-20.355c-10.481,0-20.027,1.236-28.679,3.254
	c26.708-21.309,55.11-32.107,84.581-32.107C181.414,81.311,213.006,94.775,242.386,121.33z M149.566,215.66
	c-0.255,0.004-0.508,0.006-0.761,0.006c-30.753,0-57.03-24.543-58.756-55.059c-0.576-10.182,1.532-20.449,5.967-29.467
	c14.75,0.443,30.273,3.752,46.367,9.863c-6.513,2.467-11.15,8.746-11.15,16.123c0,9.529,7.725,17.254,17.254,17.254
	c9.53,0,17.255-7.725,17.255-17.254c0-2.188-0.423-4.27-1.165-6.195c14.216,6.877,28.109,12.195,41.607,15.93
	C201.407,193.805,176.931,215.301,149.566,215.66z M24.399,157.406c7.854-7.486,24.003-19.863,48.444-24.496
	c-2.939,9.27-4.228,19.109-3.676,28.879c0.802,14.186,5.504,27.418,13.009,38.691c-9.661-4.6-19.119-10.234-28.351-16.899
	C40.133,173.697,30.127,163.703,24.399,157.406z M243.152,183.582c-9.23,6.662-18.688,12.297-28.347,16.897
	c5.749-8.693,9.864-18.547,11.835-29.119c8.616,1.387,17.05,2.105,25.268,2.105c0,0,0,0,0.002,0c1.422,0,2.805-0.021,4.151-0.063
	C252.219,176.703,247.908,180.148,243.152,183.582z"
                />
              </svg>
              <svg class="mt-px" v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#333" viewBox="0 0 297 297">
                <path
                  d="M294.908,124.97c-0.566-0.755-14.168-18.72-38.881-36.692c-32.842-23.887-70.023-36.512-107.525-36.512
	c-37.501,0-74.683,12.625-107.526,36.511C16.262,106.25,2.658,124.215,2.092,124.97c-2.789,3.719-2.789,8.831,0,12.55
	c0.497,0.663,11.019,14.555,30.262,30.084L18.36,195.59c-2.583,5.165-0.489,11.447,4.678,14.029
	c1.501,0.751,3.096,1.106,4.668,1.106c3.836,0,7.529-2.118,9.361-5.783l12.429-24.855c10.645,6.962,21.689,12.783,33.009,17.412
	l-12.379,24.758c-2.583,5.165-0.489,11.447,4.678,14.03c1.501,0.75,3.097,1.105,4.668,1.105c3.836,0,7.53-2.118,9.362-5.783
	l13.631-27.262c11.7,3.266,23.604,5.3,35.578,6.048v24.381c0,5.775,4.683,10.458,10.458,10.458c5.775,0,10.458-4.683,10.458-10.458
	v-24.381c11.976-0.748,23.878-2.782,35.578-6.048l13.631,27.262c1.833,3.665,5.525,5.783,9.362,5.783
	c1.571,0,3.168-0.355,4.668-1.105c5.167-2.583,7.261-8.865,4.678-14.03L214.497,197.5c11.321-4.63,22.364-10.451,33.01-17.414
	l12.428,24.856c1.832,3.665,5.524,5.783,9.361,5.783c1.572,0,3.168-0.355,4.669-1.106c5.166-2.582,7.26-8.864,4.677-14.029
	l-13.993-27.987c19.244-15.528,29.763-29.42,30.26-30.083C297.697,133.801,297.697,128.689,294.908,124.97z M243.167,157.701
	c-29.514,21.305-61.363,32.107-94.665,32.107c-33.303,0-65.152-10.803-94.668-32.107c-13.898-10.031-23.998-20.177-29.681-26.456
	c5.686-6.283,15.785-16.428,29.681-26.457c29.516-21.305,61.365-32.106,94.668-32.106c33.302,0,65.151,10.802,94.665,32.106
c13.898,10.031,23.998,20.177,29.681,26.457C267.162,137.527,257.063,147.672,243.167,157.701z"
                />
              </svg>
            </span>
          </div>
          <!-- Forgot password modal -->
          <div v-if="showForgot" class="fixed inset-0 z-50 flex h-screen w-screen items-start justify-center bg-black/50 backdrop-blur-2xl">
            <div class="relative mt-40 w-92 bg-white px-5 pb-5 pt-3">
              <a @click="showForgot = false" class="ah-5 aw-5 absolute top-2 right-2 flex cursor-pointer items-center justify-center bg-black pl-px text-white">&times;</a>
              <p class="mt-6 leading-normal mb-3 ml-px text-left">We got you covered. Just enter your email—our magic link will log you in and allow you to reset your password.</p>
              <input v-model="forgotEmail" type="email" placeholder="Email" required class="mb-2 w-full" />
              <button @click="handleForgotPassword" :disabled="!isValidEmail(forgotEmail)" class="w-full rounded bg-blue-600 py-2 text-white">Send Reset Link</button>
            </div>
          </div>
          <button type="submit" :disabled="!email || !isValidEmail(email) || !password || email.length === 0 || password.length === 0">Login</button>
        </form>
      </div>
      <div v-else class="max-w-md min-w-md">
        <form @submit.prevent="handleSignUp">
          <input v-model="newEmail" type="email" placeholder="Email" required autocomplete="email" />
          <div class="relative flex w-full items-center">
            <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" placeholder="Password" required autocomplete="current-password" @input="validatePassword" />
            <span @click="showNewPassword = !showNewPassword" class="absolute right-3 flex cursor-pointer items-center">
              <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#333" viewBox="0 0 297 297">
                <path d="M294.943,150.859c-2.787-4.447-15.897-24.469-38.049-44.607c-32.998-29.998-70.482-45.855-108.402-45.855c-37.921,0-75.406,15.857-108.407,45.855C15.501,128.6,2.045,150.813,1.483,151.746c-0.046,0.076-0.067,0.133-0.108,0.207c-2.043,3.58-1.811,8.084,0.712,11.447c0.567,0.756,14.168,18.721,38.88,36.691c32.841,23.887,70.02,36.512,107.52,36.512s74.681-12.625,107.523-36.51c24.712-17.973,38.315-35.938,38.882-36.693C297.686,159.676,297.702,154.557,294.943,150.859z M242.386,121.33c12.041,10.881,21.241,21.871,27.209,29.758c-4.657,0.818-10.574,1.461-17.688,1.461c-24.835,0-52.252-7.412-81.488-22.029c-27.013-13.508-53.199-20.355-77.83-20.355c-10.481,0-20.027,1.236-28.679,3.254c26.708-21.309,55.11-32.107,84.581-32.107C181.414,81.311,213.006,94.775,242.386,121.33z M149.566,215.66c-0.255,0.004-0.508,0.006-0.761,0.006c-30.753,0-57.03-24.543-58.756-55.059c-0.576-10.182,1.532-20.449,5.967-29.467c14.75,0.443,30.273,3.752,46.367,9.863c-6.513,2.467-11.15,8.746-11.15,16.123c0,9.529,7.725,17.254,17.254,17.254c9.53,0,17.255-7.725,17.255-17.254c0-2.188-0.423-4.27-1.165-6.195c14.216,6.877,28.109,12.195,41.607,15.93C201.407,193.805,176.931,215.301,149.566,215.66z M24.399,157.406c7.854-7.486,24.003-19.863,48.444-24.496c-2.939,9.27-4.228,19.109-3.676,28.879c0.802,14.186,5.504,27.418,13.009,38.691c-9.661-4.6-19.119-10.234-28.351-16.899C40.133,173.697,30.127,163.703,24.399,157.406z M243.152,183.582c-9.23,6.662-18.688,12.297-28.347,16.897c5.749-8.693,9.864-18.547,11.835-29.119c8.616,1.387,17.05,2.105,25.268,2.105c0,0,0,0,0.002,0c1.422,0,2.805-0.021,4.151-0.063C252.219,176.703,247.908,180.148,243.152,183.582z" />
              </svg>
              <svg class="mt-px" v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#333" viewBox="0 0 297 297">
                <path d="M294.908,124.97c-0.566-0.755-14.168-18.72-38.881-36.692c-32.842-23.887-70.023-36.512-107.525-36.512c-37.501,0-74.683,12.625-107.526,36.511C16.262,106.25,2.658,124.215,2.092,124.97c-2.789,3.719-2.789,8.831,0,12.55c0.497,0.663,11.019,14.555,30.262,30.084L18.36,195.59c-2.583,5.165-0.489,11.447,4.678,14.029c1.501,0.751,3.096,1.106,4.668,1.106c3.836,0,7.529-2.118,9.361-5.783l12.429-24.855c10.645,6.962,21.689,12.783,33.009,17.412l-12.379,24.758c-2.583,5.165-0.489,11.447,4.678,14.03c1.501,0.75,3.097,1.105,4.668,1.105c3.836,0,7.53-2.118,9.362-5.783l13.631-27.262c11.7,3.266,23.604,5.3,35.578,6.048v24.381c0,5.775,4.683,10.458,10.458,10.458c5.775,0,10.458-4.683,10.458-10.458v-24.381c11.976-0.748,23.878-2.782,35.578-6.048l13.631,27.262c1.833,3.665,5.525,5.783,9.362,5.783c1.571,0,3.168-0.355,4.668-1.105c5.167-2.583,7.261-8.865,4.678-14.03L214.497,197.5c11.321-4.63,22.364-10.451,33.01-17.414l12.428,24.856c1.832,3.665,5.524,5.783,9.361,5.783c1.572,0,3.168-0.355,4.669-1.106c5.166-2.582,7.26-8.864,4.677-14.029l-13.993-27.987c19.244-15.528,29.763-29.42,30.26-30.083C297.697,133.801,297.697,128.689,294.908,124.97z M243.167,157.701c-29.514,21.305-61.363,32.107-94.665,32.107c-33.303,0-65.152-10.803-94.668-32.107c-13.898-10.031-23.998-20.177-29.681-26.456c5.686-6.283,15.785-16.428,29.681-26.457c29.516-21.305,61.365-32.106,94.668-32.106c33.302,0,65.151,10.802,94.665,32.106c13.898,10.031,23.998,20.177,29.681,26.457C267.162,137.527,257.063,147.672,243.167,157.701z" />
              </svg>
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
        <div class="bg-gray/30 mt-3 mb-8 flex h-px w-full items-center justify-center">
          <span class="text-gray mb-px bg-white px-3 text-sm">or continue with</span>
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
    <Toast :message="errorMessage" :show="showToast" />
  </div>
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../main";
import Toast from "../components/Toast.vue";

const router = useRouter();
const tab = ref("login");
const email = ref("");
const password = ref("");
const newEmail = ref("");
const newPassword = ref("");
const errorMessage = ref("");
const showPassword = ref(false);
const showNewPassword = ref(false);
const showToast = ref(false);
const showForgot = ref(false);
const forgotEmail = ref("");

async function handleForgotPassword() {
  errorMessage.value = "";
  const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.value, {
    redirectTo: window.location.origin + "/reset-password",
  });

  if (error) {
    errorMessage.value = error.message;
  } else {
    errorMessage.value = "Password reset email sent!";
  }
}

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

watch(errorMessage, (val) => {
  if (val) {
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      errorMessage.value = "";
    }, 2000);
  }
});

async function handleSignIn() {
  errorMessage.value = "";
  try {
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value });
    if (err) {
      errorMessage.value = err.message + ".";
      return;
    }

    router.push("/world");
  } catch (e) {}
}

async function handleSignUp() {
  errorMessage.value = "";
  const { error: err } = await supabase.auth.signUp({ email: newEmail.value, password: newPassword.value });
  if (err) {
    if (err.message && err.message.toLowerCase().includes("already registered")) {
      errorMessage.value = "An account with this email already exists.";
      return;
    }
    errorMessage.value = err.message;
    return;
  }

  router.push("/world");
}

async function handleGoogle() {
  errorMessage.value = "";
  const { error: err } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/game" } });
  if (err) {
    errorMessage.value = err.message;
    return;
  }
}

async function handleEvm() {
  errorMessage.value = "";
  errorMessage.value = "EVM wallet login is not implemented yet.";
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
