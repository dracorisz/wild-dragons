<template>
  <div class="mb-8 flex items-center gap-4">
    <input v-model="local.search" @input="emitControls" placeholder="Search..." class="flex-1 border border-[#333] bg-[#23272a] px-3 py-2 text-white" />

    <!-- <label class="flex items-center gap-2 text-sm text-[#ccc]">
      <input type="checkbox" v-model="local.myOrders" @change="emitControls" />
      My Orders Only
    </label> -->

    <select v-model="local.currency" @change="emitControls" class="!rounded-0 h-[36px] border border-[#333] bg-[#23272a] px-3 text-white">
      <option value="All">All</option>
      <option value="USDC">USDC</option>
      <option value="IMX">IMX</option>
      <option value="RON">RON</option>
    </select>

    <select v-model="local.sort" @change="emitControls" class="!rounded-0 h-[36px] border border-[#333] bg-[#23272a] px-3 text-white">
      <option value="price">Sort: Price</option>
      <option value="rarity">Sort: Rarity</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "MarketControls",
  props: {
    controls: { type: Object, default: () => ({ search: "", myOrders: false, sort: "price", currency: "All" }) },
  },
  emits: ["update:controls"],
  data() {
    return {
      local: {
        search: this.controls.search || "",
        myOrders: this.controls.myOrders || false,
        sort: this.controls.sort || "price",
        currency: this.controls.currency || "All",
      },
    };
  },
  watch: {
    controls: {
      deep: true,
      handler(v) {
        this.local = { ...this.local, ...v };
      },
    },
  },
  methods: {
    emitControls() {
      this.$emit("update:controls", { ...this.local });
    },
  },
};
</script>
