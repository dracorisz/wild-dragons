<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="w-full grid grid-cols-1 bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold mb-6 text-center">Profile</h2>
      <form class="form-profile" @submit.prevent="saveProfile">
        <div class="flex flex-col items-center mb-5 w-full">
          <img :src="form.avatar_url || defaultAvatar" class="w-24 h-24 rounded-full mb-2" />
          <input type="file" accept="image/*" @change="onAvatarChange" class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">Username</label>
          <input v-model="form.username" type="text" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">Display Name</label>
          <input v-model="form.display_name" type="text" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">Phone</label>
          <div class="flex gap-2">
            <select v-model="form.phone_country" class="px-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option v-for="c in countryCodes" :key="c.code" :value="c.code">{{ c.name }} ({{ c.code }})</option>
            </select>
            <input v-model="form.phone" type="tel" class="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Phone number" />
          </div>
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">Address</label>
          <input v-model="form.address" type="text" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">Country</label>
          <input v-model="form.country" type="text" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">City</label>
          <input v-model="form.city" type="text" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">Birthdate</label>
          <input v-model="form.birthdate" type="date" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">Gender</label>
          <select v-model="form.gender" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <div class="mb-5 md:col-span-2">
          <label class="block text-sm font-medium mb-1">Bio</label>
          <textarea v-model="form.bio" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"></textarea>
        </div>
        <div class="mb-5 md:col-span-2">
          <label class="block text-sm font-medium mb-1">Wallets (JSON)</label>
          <textarea v-model="walletsString" @input="onWalletsInput" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500 h-32 font-mono"></textarea>
        </div>
        <div class="mb-5"><label class="block text-sm font-medium mb-1">Email Verified</label><input :value="form.email_verified ? 'Yes' : 'No'" type="text" class="w-full px-4 py-2 border rounded bg-gray-100" disabled /></div>
        <div class="mb-5"><label class="block text-sm font-medium mb-1">Phone Verified</label><input :value="form.phone_verified ? 'Yes' : 'No'" type="text" class="w-full px-4 py-2 border rounded bg-gray-100" disabled /></div>
        <div class="mb-5"><label class="block text-sm font-medium mb-1">Active</label><input :value="form.is_active ? 'Yes' : 'No'" type="text" class="w-full px-4 py-2 border rounded bg-gray-100" disabled /></div>
        <div class="mb-5"><label class="block text-sm font-medium mb-1">Created At</label><input :value="form.created_at" type="text" class="w-full px-4 py-2 border rounded bg-gray-100" disabled /></div>
        <div class="mb-5"><label class="block text-sm font-medium mb-1">Last Login</label><input :value="form.last_login" type="text" class="w-full px-4 py-2 border rounded bg-gray-100" disabled /></div>
        <div class="md:col-span-2 flex flex-col gap-2">
          <button type="submit" class="w-full py-2 px-4 rounded bg-violet-600 text-white font-semibold hover:bg-violet-700 transition">Save</button>
        </div>
      </form>
      <Toast v-if="toast.show" :type="toast.type" :message="toast.message" @close="toast.show = false" />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { supabase } from '../main'
import Toast from '../components/Toast.vue'

const userStore = useUserStore()
const defaultAvatar = '/default-avatar.png'
const countryCodes = [
  { name: 'United States', code: '+1' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'Canada', code: '+1' },
  { name: 'Australia', code: '+61' },
  { name: 'Germany', code: '+49' },
  { name: 'France', code: '+33' },
  { name: 'India', code: '+91' },
  { name: 'Japan', code: '+81' },
  { name: 'China', code: '+86' },
  { name: 'Other', code: '' }
]
const form = ref({
  email: '',
  username: '',
  display_name: '',
  phone_country: '',
  phone: '',
  address: '',
  country: '',
  city: '',
  birthdate: '',
  gender: '',
  bio: '',
  wallets: {},
  avatar_url: '',
  avatar_origin: '',
  email_verified: false,
  phone_verified: false,
  is_active: true,
  created_at: '',
  last_login: ''
})
const walletsString = ref('{}')
const toast = ref({ show: false, type: 'success', message: '' })

onMounted(async () => {
  await userStore.fetchUser()
  const user = userStore.user
  if (!user) return
  const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
  if (data) {
    Object.assign(form.value, data)
    walletsString.value = JSON.stringify(data.wallets || {}, null, 2)
    // Try to split phone into country code and number if possible
    if (data.phone) {
      const match = data.phone.match(/^(\+\d+)\s*(.*)$/)
      if (match) {
        form.value.phone_country = match[1]
        form.value.phone = match[2]
      }
    }
  }
})

function onWalletsInput() {
  try {
    form.value.wallets = JSON.parse(walletsString.value)
    toast.value.show = false
  } catch {
    toast.value = { show: true, type: 'error', message: 'Invalid JSON format' }
  }
}

async function onAvatarChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const fileExt = file.name.split('.').pop()
  const fileName = `${form.value.id || 'profile'}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`
  const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
  if (!error) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    form.value.avatar_url = data.publicUrl
    form.value.avatar_origin = 'custom'
  }
}

async function saveProfile() {
  try {
    form.value.wallets = JSON.parse(walletsString.value)
  } catch {
    toast.value = { show: true, type: 'error', message: 'Invalid JSON format' }
    return
  }
  // Combine phone country code and number
  const phoneFull = form.value.phone_country ? `${form.value.phone_country} ${form.value.phone}` : form.value.phone
  const { error } = await supabase.from('users').update({
    email: form.value.email,
    username: form.value.username,
    display_name: form.value.display_name,
    phone: phoneFull,
    address: form.value.address,
    country: form.value.country,
    city: form.value.city,
    birthdate: form.value.birthdate,
    gender: form.value.gender,
    bio: form.value.bio,
    wallets: form.value.wallets,
    avatar_url: form.value.avatar_url,
    avatar_origin: form.value.avatar_origin
  }).eq('id', form.value.id)
  if (!error) {
    await userStore.fetchUser()
    toast.value = { show: true, type: 'success', message: 'Profile saved!' }
  } else {
    toast.value = { show: true, type: 'error', message: 'Error saving profile' }
  }
}
</script>
