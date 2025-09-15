<template>
  <div class="bg-popover space-y-6 rounded-lg border p-6 w-[320px] sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[550px] 2xl:w-[600px]">
    <div class="mb-8 text-center">
      <Typography tag="h2" variant="title" size="3xl" class="mb-2"> {{ gameIcon }} {{ gameTitle }} </Typography>
    </div>

    <!-- Auth Mode Toggle -->
    <div class="mb-6 flex space-x-2">
      <Button @click="authMode = 'signin'" :variant="authMode === 'signin' ? 'primary' : 'secondary'" size="md" class="flex-1">
        {{ signInText }}
      </Button>
      <Button @click="authMode = 'signup'" :variant="authMode === 'signup' ? 'primary' : 'secondary'" size="md" class="flex-1">
        {{ signUpText }}
      </Button>
    </div>

    <!-- Auth Form -->
    <form @submit.prevent="handleAuth" class="space-y-4">
      <!-- Username field for signup -->
      <div v-if="authMode === 'signup'">
        <Input v-model="form.username" type="text" :label="usernameText" required :placeholder="`Enter ${usernameText.toLowerCase()}`" />
      </div>

      <!-- Email field -->
      <div>
        <Input v-model="form.email" type="email" :label="emailText" required autocomplete="email" :placeholder="`Enter ${emailText.toLowerCase()}`" />
      </div>

      <!-- Password field -->
      <div>
        <Input v-model="form.password" type="password" :label="passwordText" required autocomplete="current-password" :placeholder="`Enter ${passwordText.toLowerCase()}`" />
      </div>

      <!-- Referral code field for signup -->
      <div v-if="authMode === 'signup'">
        <Input v-model="form.referralCode" type="text" :label="referralCodeText" :helper="'(optional)'" autocomplete="off" :placeholder="`Enter ${referralCodeText.toLowerCase()}`" />
      </div>

      <!-- Submit button -->
      <Button type="submit" :disabled="authStore.loading" variant="primary" size="lg" class="w-full">
        <span v-if="authStore.loading" class="flex items-center justify-center">
          <span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {{ loadingText }}
        </span>
        <span v-else>
          {{ authMode === "signin" ? signInText : signUpText }}
        </span>
      </Button>
    </form>

    <!-- Success Message -->
    <div v-if="success" class="mt-4">
      <Card variant="default" class="border-green-200 bg-green-50 p-3">
        <Typography variant="body" size="sm" class="text-green-800">
          {{ success }}
        </Typography>
      </Card>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4">
      <Card variant="default" class="border-red-200 bg-red-50 p-3">
        <Typography variant="body" size="sm" class="text-red-800">
          {{ error }}
        </Typography>
      </Card>
    </div>

    <!-- Back button -->
    <div class="text-center">
      <Button variant="ghost" @click="handleClose">
        <Typography variant="caption" size="sm" class="text-muted-foreground">
          {{ backHomeText }}
        </Typography>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores";
import { Button, Card, Typography, Input } from "./ui";
import themeManager from "../lib/themeManager.js";

const router = useRouter();
const authStore = useAuthStore();

// Props for modal visibility
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "update:visible"]);

// Theme-aware content
const gameTitle = computed(() => themeManager.getText("ui.game_title"));
const gameSubtitle = computed(() => themeManager.getText("ui.game_subtitle"));
const gameIcon = computed(() => themeManager.getAsset("hero_icon"));
const signInText = computed(() => themeManager.getText("ui.auth_sign_in"));
const signUpText = computed(() => themeManager.getText("ui.auth_sign_up"));
const emailText = computed(() => themeManager.getText("ui.auth_email"));
const passwordText = computed(() => themeManager.getText("ui.auth_password"));
const usernameText = computed(() => themeManager.getText("ui.auth_username"));
const referralCodeText = computed(() => themeManager.getText("ui.auth_referral_code"));
const loadingText = computed(() => themeManager.getText("ui.auth_loading"));
const backHomeText = computed(() => themeManager.getText("ui.auth_back_home"));

const authMode = ref("signin");
const error = ref("");
const success = ref("");

const form = reactive({
  username: "",
  email: "",
  password: "",
  referralCode: "",
});

const handleAuth = async () => {
  try {
    error.value = "";
    success.value = "";

    if (authMode.value === "signup") {
      if (!form.username || !form.username.trim()) {
        error.value = "Username is required";
        return;
      }

      const result = await authStore.signUp(form.email, form.password, form.username, form.referralCode || null);

      // Check if email confirmation is needed
      if (result && result.needsEmailConfirmation) {
        success.value = "Account created successfully! Please check your email for a confirmation link.";
        return; // Don't redirect yet, wait for email confirmation
      }

      // If no email confirmation needed, redirect immediately
      success.value = "Account created successfully!";
      setTimeout(() => {
        handleClose();
        router.push("/play");
      }, 1500);
    } else {
      await authStore.signIn(form.email, form.password);
      // Only redirect on successful sign in
      handleClose();
      router.push("/play");
    }
  } catch (err) {
    error.value = err.message || `Failed to ${authMode.value}`;
  }
};

const handleClose = () => {
  emit("close");
  emit("update:visible", false);
  // Reset form state when closing
  error.value = "";
  success.value = "";
  form.username = "";
  form.email = "";
  form.password = "";
  form.referralCode = "";
  authMode.value = "signin";
};
</script>
