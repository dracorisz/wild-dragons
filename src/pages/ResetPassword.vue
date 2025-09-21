<template>
  <div v-if="sessionValid" class="page">
    <h2 class="!mb-0">Reset Password</h2>
    <div class="flex w-full flex-col items-center">
      <form v-if="sessionValid" @submit.prevent="handleReset" class="max-w-md min-w-md">
        <div class="relative flex w-full items-center">
          <input :type="showPassword ? 'text' : 'password'" v-model="newPassword" placeholder="New Password" required class="w-full" @input="validatePassword" />
          <span @click="showPassword = !showPassword" class="absolute right-3 flex cursor-pointer items-center">
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#333" viewBox="0 0 297 297">
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
        <button type="submit" :disabled="!isFormValid">Set New Password</button>
      </form>
    </div>
    <Toast :message="errorMessage" :show="showToast" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { supabase } from "../main";
import Toast from "../components/Toast.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const showToast = ref(false);
const newPassword = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const passwordCriteria = ref({
  minLength: false,
  lowercase: false,
  uppercase: false,
  digit: false,
  specialChar: false,
});
const isFormValid = ref(false);

const sessionValid = ref(false);

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  sessionValid.value = !!data.session;
  if (!sessionValid.value) {
    router.push("/connect");
    // errorMessage.value = "This page is only accessible via a valid password reset link.";
  }
});

function validatePassword() {
  const password = newPassword.value;
  passwordCriteria.value.minLength = password.length >= 8;
  passwordCriteria.value.lowercase = /[a-z]/.test(password);
  passwordCriteria.value.uppercase = /[A-Z]/.test(password);
  passwordCriteria.value.digit = /\d/.test(password);
  passwordCriteria.value.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  isFormValid.value = Object.values(passwordCriteria.value).every(Boolean);
}

async function handleReset() {
  errorMessage.value = "";
  if (!sessionValid.value) {
    errorMessage.value = "Session missing. Please use the password reset link from your email.";
    return;
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword.value });
  if (error) {
    errorMessage.value = error.message;
  } else {
    errorMessage.value = "Password updated!";
  }
}

watch(errorMessage, (val) => {
  if (val) {
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      errorMessage.value = "";
    }, 2000);
  }
});

</script>
