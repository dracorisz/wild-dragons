<template>
  <div class="mb-8 relative overflow-hidden ah-72">
    <img src="https://miro.medium.com/max/4700/1*npehtcNUxq-dkpITT0ojaw.png" alt="Banner" class="w-full h-full object-cover" />
    <div class="absolute left-6 bottom-4 text-left text-white flex flex-col gap-3">
      <div class="flex items-center flex-col">
        <h2 class="!mb-0 -ml-1">Wild Dragons Marketplace</h2>
        <div class="banner-stats text-sm">
          <span class="mr-4">10k items</span>
          <span class="mr-4">4.7% listed</span>
          <span>Floor: 0.001245 ETH</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: "MarketBanner" };
</script>