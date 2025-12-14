import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMintingStore = defineStore('minting', () => {
  const isMintingMode = ref(false);
  const mintingQueue = ref([]);
  const completedMints = ref([]);
  const mintingHistory = ref([]);
  const mintingStatus = ref('idle');
  const lastSync = ref(null);
  const autoPublishEnabled = ref(true);
  const batchSize = ref(5);
  const mintingStats = ref({
    totalMinted: 0,
    successRate: 0,
    averageTime: 0,
    gasSaved: 0,
    autoApproved: 0,
    manualApproved: 0
  });

  const totalPendingMints = computed(() => mintingQueue.value.length);
  const totalCompletedMints = computed(() => completedMints.value.length);
  const isProcessing = computed(() => mintingStatus.value !== 'idle');
  const canMint = computed(() => mintingQueue.value.length > 0 && mintingStatus.value === 'idle');
  const queueValue = computed(() => mintingQueue.value.reduce((total, item) => total + (item.estimatedValue || 0), 0));
  const successRate = computed(() => {
    const total = mintingHistory.value.length;
    if (!total) return 0;
    return (mintingHistory.value.filter(entry => entry.success).length / total) * 100;
  });

  const initialize = async () => {
    isMintingMode.value = window.location.search.includes('branch=minting') ||
      localStorage.getItem('mintingMode') === 'true';
    loadMintingData();
    loadMintingStats();
    if (isMintingMode.value) setupAutoSync();
  };

  const loadMintingData = () => {
    const savedQueue = localStorage.getItem('mintingQueue');
    const savedCompleted = localStorage.getItem('completedMints');
    const savedHistory = localStorage.getItem('mintingHistory');
    if (savedQueue) mintingQueue.value = JSON.parse(savedQueue);
    if (savedCompleted) completedMints.value = JSON.parse(savedCompleted);
    if (savedHistory) mintingHistory.value = JSON.parse(savedHistory);
  };

  const saveMintingData = () => {
    localStorage.setItem('mintingQueue', JSON.stringify(mintingQueue.value));
    localStorage.setItem('completedMints', JSON.stringify(completedMints.value));
    localStorage.setItem('mintingHistory', JSON.stringify(mintingHistory.value));
  };

  const loadMintingStats = () => {
    const savedStats = localStorage.getItem('mintingStats');
    if (savedStats) mintingStats.value = { ...mintingStats.value, ...JSON.parse(savedStats) };
  };

  const setupAutoSync = () => {
    setInterval(() => {
      if (autoPublishEnabled.value && mintingQueue.value.length) syncWithTokenTrove();
    }, 30000);
    setInterval(() => {
      if (mintingQueue.value.length >= batchSize.value) processBatchMinting();
    }, 120000);
  };

  const addToMintQueue = (item) => {
    const mintItem = {
      ...item,
      id: `mint_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      queuedAt: new Date().toISOString(),
      status: 'queued',
      priority: item.priority || 'normal',
      estimatedValue: item.estimatedValue || 0,
      autoApproved: item.autoApproved || false
    };
    mintingQueue.value.push(mintItem);
    mintingQueue.value.sort((a, b) => {
      const order = { high: 3, medium: 2, normal: 1, low: 0 };
      return order[b.priority] - order[a.priority];
    });
    if (mintItem.autoApproved) mintingStats.value.autoApproved++;
    saveMintingData();
    if (mintingQueue.value.length && window.Toast) window.Toast.minting(`Queued ${mintItem.type}`, 'Minting Queue');
    return mintItem.id;
  };

  const removeFromQueue = (id) => {
    mintingQueue.value = mintingQueue.value.filter(item => item.id !== id);
    saveMintingData();
  };

  const clearCompleted = () => {
    mintingQueue.value = [];
    saveMintingData();
  };

  const syncWithTokenTrove = async () => {
    if (mintingStatus.value === 'processing') return;
    try {
      mintingStatus.value = 'processing';
      const tokenTrove = window.HeroinesDragon?.tokenTrove;
      if (tokenTrove) await tokenTrove.syncMintingData();
      lastSync.value = new Date().toISOString();
    } catch (error) {
      console.error('Minting sync failed:', error);
      mintingStatus.value = 'error';
    } finally {
      if (mintingStatus.value === 'processing') mintingStatus.value = 'idle';
    }
  };

  const processBatchMinting = async () => {
    if (!mintingQueue.value.length || mintingStatus.value !== 'idle') return;
    const batch = mintingQueue.value.splice(0, batchSize.value);
    mintingStatus.value = 'batching';
    const start = Date.now();

    try {
      for (const item of batch) {
        item.status = 'processing';
        await simulateMinting(item);
        item.status = 'completed';
        item.completedAt = new Date().toISOString();
        completedMints.value.unshift(item);
        mintingHistory.value.unshift({ id: item.id, type: item.type, success: true, timestamp: item.completedAt, value: item.estimatedValue });
        mintingStats.value.totalMinted++;
      }
      const elapsed = Date.now() - start;
      mintingStats.value.averageTime = mintingStats.value.averageTime
        ? (mintingStats.value.averageTime + elapsed) / 2
        : elapsed;
      updateMintingStats();
      saveMintingData();
    } catch (error) {
      console.error('Batch minting failed:', error);
      batch.forEach(item => {
        item.status = 'queued';
        mintingQueue.value.unshift(item);
      });
      mintingStatus.value = 'error';
    } finally {
      if (mintingStatus.value !== 'error') mintingStatus.value = 'idle';
    }
  };

  const simulateMinting = (item) => new Promise((resolve, reject) => {
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => Math.random() < 0.95 ? resolve() : reject(new Error('Minting failed')), delay);
  });

  const updateMintingStats = () => {
    const total = mintingHistory.value.length;
    if (total) {
      const successes = mintingHistory.value.filter(entry => entry.success).length;
      mintingStats.value.successRate = (successes / total) * 100;
    }
    localStorage.setItem('mintingStats', JSON.stringify(mintingStats.value));
  };

  const toggleMintingMode = () => {
    isMintingMode.value = !isMintingMode.value;
    localStorage.setItem('mintingMode', isMintingMode.value.toString());
    if (isMintingMode.value) setupAutoSync();
  };

  const setBatchSize = value => {
    batchSize.value = Math.max(1, Math.min(Number(value), 20));
  };

  const toggleAutoPublish = () => {
    autoPublishEnabled.value = !autoPublishEnabled.value;
  };

  const exportMintingData = () => ({
    queue: mintingQueue.value,
    completed: completedMints.value,
    history: mintingHistory.value,
    stats: mintingStats.value,
    exportedAt: new Date().toISOString()
  });

  const importMintingData = data => {
    if (data.queue) mintingQueue.value = data.queue;
    if (data.completed) completedMints.value = data.completed;
    if (data.history) mintingHistory.value = data.history;
    if (data.stats) mintingStats.value = { ...mintingStats.value, ...data.stats };
    saveMintingData();
    updateMintingStats();
  };

  return {
    isMintingMode,
    mintingQueue,
    completedMints,
    mintingHistory,
    mintingStatus,
    lastSync,
    autoPublishEnabled,
    batchSize,
    mintingStats,
    totalPendingMints,
    totalCompletedMints,
    isProcessing,
    canMint,
    queueValue,
    successRate,
    initialize,
    addToMintQueue,
    removeFromQueue,
    clearCompleted,
    syncWithTokenTrove,
    processBatchMinting,
    toggleMintingMode,
    setBatchSize,
    toggleAutoPublish,
    exportMintingData,
    importMintingData,
    saveMintingData
  };
});

