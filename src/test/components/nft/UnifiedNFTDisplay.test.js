import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { ref } from 'vue'
import UnifiedNFTDisplay from '../../../components/nft/UnifiedNFTDisplay.vue'

// Mock composables
vi.mock('../../../composables/useNFTData.js', () => ({
  useNFTData: () => ({
    collections: ref({ 'dragons': { name: 'Wild Dragons', item_count: 12 } }),
    nfts: ref([
      {
        id: 'dragons_1',
        name: 'Fire Wild Dragons #1',
        collection: 'Wild Dragons',
        traits: { element: 'Fire', rarity: 'Epic' }
      }
    ]),
    loading: ref(false),
    error: ref(null),
    fetchAllNFTs: vi.fn(),
    refreshData: vi.fn()
  })
}))

vi.mock('../../../composables/useImageSources.js', () => ({
  useImageSources: () => ({
    currentSource: { value: 'internal' },
    setImageSource: vi.fn()
  })
}))

// Mock subcomponents
vi.mock('../../../components/nft/NFTFilters.vue', () => ({
  default: {
    name: 'NFTFilters',
    template: '<div class="nft-filters">Filters</div>',
    props: ['collections', 'elements', 'rarities', 'selected-collection', 'selected-elements', 'selected-rarities']
  }
}))

vi.mock('../../../components/nft/NFTGridLayout.vue', () => ({
  default: {
    name: 'NFTGridLayout',
    template: '<div class="nft-grid">Grid</div>',
    props: ['nfts', 'loading', 'empty', 'image-source']
  }
}))

vi.mock('../../../components/nft/NFTDetailModal.vue', () => ({
  default: {
    name: 'NFTDetailModal',
    template: '<div class="nft-modal">Modal</div>',
    props: ['nft']
  }
}))

vi.mock('../../../components/nft/NFTNavigation.vue', () => ({
  default: {
    name: 'NFTNavigation',
    template: '<div class="nft-navigation">Navigation</div>',
    props: ['collections', 'active-collection']
  }
}))

describe('UnifiedNFTDisplay.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(UnifiedNFTDisplay, {
      props: {
        showMint: true
      },
      global: {
        stubs: {
          NFTFilters: true,
          NFTGridLayout: true,
          NFTDetailModal: true,
          NFTNavigation: true
        }
      }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders subcomponents', () => {
    expect(wrapper.findComponent({ name: 'NFTNavigation' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NFTFilters' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NFTGridLayout' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NFTDetailModal' }).exists()).toBe(true)
  })

  it.skip('passes correct props to subcomponents', () => {
    const navigation = wrapper.findComponent({ name: 'NFTNavigation' })
    expect(navigation.props('collections')).toEqual({ 'dragons': { name: 'Wild Dragons', item_count: 12 } })
    expect(navigation.props('active-collection')).toBe(null)

    const filters = wrapper.findComponent({ name: 'NFTFilters' })
    expect(filters.props('collections')).toEqual({ 'dragons': { name: 'Wild Dragons', item_count: 12 } })
    expect(filters.props('selected-collection')).toBeUndefined()
  })

  it('handles collection change', async () => {
    const filters = wrapper.findComponent({ name: 'NFTFilters' })
    await filters.vm.$emit('collection-change', 'dragons')

    expect(wrapper.vm.selectedCollection).toBe('dragons')
  })

  it('handles element change', async () => {
    const filters = wrapper.findComponent({ name: 'NFTFilters' })
    await filters.vm.$emit('element-change', 'Fire')

    expect(wrapper.vm.selectedElements).toContain('Fire')
  })

  it('handles rarity change', async () => {
    const filters = wrapper.findComponent({ name: 'NFTFilters' })
    await filters.vm.$emit('rarity-change', 'Epic')

    expect(wrapper.vm.selectedRarities).toContain('Epic')
  })

  it('resets filters', async () => {
    wrapper.vm.selectedCollection = 'dragons'
    wrapper.vm.selectedElements = ['Fire']
    wrapper.vm.selectedRarities = ['Epic']

    const filters = wrapper.findComponent({ name: 'NFTFilters' })
    await filters.vm.$emit('reset-filters')

    expect(wrapper.vm.selectedCollection).toBe(null)
    expect(wrapper.vm.selectedElements).toEqual([])
    expect(wrapper.vm.selectedRarities).toEqual([])
  })

  it('handles NFT selection', async () => {
    const grid = wrapper.findComponent({ name: 'NFTGridLayout' })
    const testNft = { id: 'test', name: 'Test NFT' }
    await grid.vm.$emit('select-nft', testNft)

    expect(wrapper.vm.selectedNFT).toEqual(testNft)
  })

  it('handles mint emission', async () => {
    const testNft = { id: 'test', name: 'Test NFT' }
    wrapper.vm.selectedNFT = testNft

    const modal = wrapper.findComponent({ name: 'NFTDetailModal' })
    await modal.vm.$emit('mint', testNft)

    expect(wrapper.emitted('mint')).toBeTruthy()
    expect(wrapper.emitted('mint')[0]).toEqual([testNft])
  })

  it('computes filtered NFTs correctly', () => {
    wrapper.vm.selectedCollection = 'dragons'
    expect(wrapper.vm.filteredNFTs.length).toBe(1)
    expect(wrapper.vm.filteredNFTs[0].collection).toBe('Wild Dragons')
  })

  it('accepts externalData prop', () => {
    const externalData = {
      collections: { 'test': { name: 'Test Collection' } },
      nfts: [{ id: 'test', name: 'Test NFT' }]
    }

    const wrapperWithData = mount(UnifiedNFTDisplay, {
      props: { externalData },
      global: { stubs: ['NFTFilters', 'NFTGridLayout', 'NFTDetailModal', 'NFTNavigation'] }
    })

    expect(wrapperWithData.vm.collections).toEqual(externalData.collections)
    expect(wrapperWithData.vm.nfts).toEqual(externalData.nfts)
  })

  it('shows loading state', async () => {
    // Mock loading state
    wrapper.vm.loading = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.loading-state').exists()).toBe(true)
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })

  it('shows error state', async () => {
    wrapper.vm.error = 'Test error'
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.error-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test error')
  })
})