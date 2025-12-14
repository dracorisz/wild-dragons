import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import NFTDetailModal from '../../../components/nft/NFTDetailModal.vue'

describe('NFTDetailModal.vue', () => {
  const mockNft = {
    id: 'test_1',
    name: 'Test Dragon NFT',
    collection: 'Wild Dragons',
    description: 'A powerful test dragon',
    image: {
      full: '/assets/dragons/dragons_1.png',
      preview: '/assets/dragons/dragons_1_preview.png'
    },
    traits: {
      rarity: 'Epic',
      element: 'Fire',
      power: 85
    },
    spiritual: {
      chakra: 'root',
      frequency_hz: 396,
      color: 'red',
      level_unlock: 3
    },
    price: {
      listed: '0.5 ETH',
      floor: '0.3 ETH',
      last_sale: '0.4 ETH'
    }
  }

  let wrapper

  beforeEach(() => {
    wrapper = mount(NFTDetailModal, {
      props: {
        nft: mockNft,
        canBuy: true,
        canList: false,
        canTransfer: true,
        canMint: true
      }
    })
  })

  it('renders the modal when nft prop is provided', () => {
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.modal-content').exists()).toBe(true)
  })

  it('does not render when nft prop is null', () => {
    const emptyWrapper = mount(NFTDetailModal, {
      props: { nft: null }
    })
    expect(emptyWrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('displays NFT information correctly', () => {
    expect(wrapper.text()).toContain('Test Dragon NFT')
    expect(wrapper.text()).toContain('Wild Dragons')
    expect(wrapper.text()).toContain('A powerful test dragon')
  })

  it('displays traits correctly', () => {
    expect(wrapper.text()).toContain('Rarity')
    expect(wrapper.text()).toContain('Epic')
    expect(wrapper.text()).toContain('Element')
    expect(wrapper.text()).toContain('Fire')
    expect(wrapper.text()).toContain('Power')
    expect(wrapper.text()).toContain('85')
  })

  it('displays spiritual attributes', () => {
    expect(wrapper.text()).toContain('Chakra')
    expect(wrapper.text()).toContain('root')
    expect(wrapper.text()).toContain('Frequency')
    expect(wrapper.text()).toContain('396 Hz')
    expect(wrapper.text()).toContain('Color')
    expect(wrapper.text()).toContain('red')
    expect(wrapper.text()).toContain('Unlock Level')
    expect(wrapper.text()).toContain('3')
  })

  it('displays pricing information', () => {
    expect(wrapper.text()).toContain('Listed Price:')
    expect(wrapper.text()).toContain('0.5 ETH')
    expect(wrapper.text()).toContain('Floor Price:')
    expect(wrapper.text()).toContain('0.3 ETH')
    expect(wrapper.text()).toContain('Last Sale:')
    expect(wrapper.text()).toContain('0.4 ETH')
  })

  it('renders the NFT image', () => {
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/assets/dragons/dragons_1.png')
    expect(img.attributes('alt')).toBe('Test Dragon NFT')
  })

  it('shows correct action buttons based on props', () => {
    expect(wrapper.find('.buy-button').exists()).toBe(true)
    expect(wrapper.find('.list-button').exists()).toBe(false)
    expect(wrapper.find('.transfer-button').exists()).toBe(true)
    expect(wrapper.find('.mint-button').exists()).toBe(true)
    expect(wrapper.find('.secondary-button').exists()).toBe(true)
  })

  it('emits close event when close button is clicked', async () => {
    const closeButton = wrapper.find('.close-button')
    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when clicking overlay', async () => {
    const overlay = wrapper.find('.modal-overlay')
    await overlay.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits mint event when mint button is clicked', async () => {
    const mintButton = wrapper.find('.mint-button')
    await mintButton.trigger('click')

    expect(wrapper.emitted('mint')).toBeTruthy()
    expect(wrapper.emitted('mint')[0]).toEqual([mockNft])
  })

  it('emits buy event when buy button is clicked', async () => {
    const buyButton = wrapper.find('.buy-button')
    await buyButton.trigger('click')

    expect(wrapper.emitted('buy')).toBeTruthy()
    expect(wrapper.emitted('buy')[0]).toEqual([mockNft])
  })

  it('emits list event when list button is clicked', async () => {
    const wrapperWithList = mount(NFTDetailModal, {
      props: {
        nft: mockNft,
        canList: true
      }
    })

    const listButton = wrapperWithList.find('.list-button')
    await listButton.trigger('click')

    expect(wrapperWithList.emitted('list')).toBeTruthy()
    expect(wrapperWithList.emitted('list')[0]).toEqual([mockNft])
  })

  it('emits transfer event when transfer button is clicked', async () => {
    const transferButton = wrapper.find('.transfer-button')
    await transferButton.trigger('click')

    expect(wrapper.emitted('transfer')).toBeTruthy()
    expect(wrapper.emitted('transfer')[0]).toEqual([mockNft])
  })

  it('handles escape key press', async () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not emit close for non-escape keys', async () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    document.dispatchEvent(event)

    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('handles missing trait values gracefully', () => {
    const incompleteNft = {
      ...mockNft,
      traits: {
        rarity: null,
        element: undefined,
        power: null
      },
      spiritual: null,
      price: null
    }

    const wrapperIncomplete = mount(NFTDetailModal, {
      props: { nft: incompleteNft }
    })

    expect(wrapperIncomplete.text()).toContain('Unknown')
    expect(wrapperIncomplete.text()).toContain('N/A')
  })

  it('prevents body scroll when mounted', () => {
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when unmounted', () => {
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('has correct modal structure', () => {
    expect(wrapper.find('.modal-grid').exists()).toBe(true)
    expect(wrapper.find('.modal-image').exists()).toBe(true)
    expect(wrapper.find('.modal-details').exists()).toBe(true)
    expect(wrapper.find('.traits-grid').exists()).toBe(true)
    expect(wrapper.find('.pricing-section').exists()).toBe(true)
    expect(wrapper.find('.action-buttons').exists()).toBe(true)
  })
})