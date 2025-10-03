// src/web3/nft.js
import { supabase } from '../main'
import { useUserStore } from '../stores/user'

export async function fetchNFTs(chain = null) {
  let query = supabase.from('nfts').select('*').order('minted_at', { ascending: false })
  if (chain) query = query.eq('attributes->>chain', chain)
  const { data, error } = await query
  if (error) return []
  return (data || []).map(nft => ({
    id: nft.id,
    name: nft.name,
    description: nft.description,
    image: nft.image_url,
    price: nft.price,
    royalty: nft.royalty,
    owner_id: nft.owner_id,
    chain: nft.attributes?.chain || 'eth',
    mintType: nft.attributes?.mintType || 'free'
  }))
}

export async function fetchMyNFTs(chain = null) {
  const userStore = useUserStore()
  const user = userStore.user
  if (!user) return []
  let query = supabase.from('nfts').select('*').eq('owner_id', user.id).order('minted_at', { ascending: false })
  if (chain) query = query.eq('attributes->>chain', chain)
  const { data, error } = await query
  if (error) return []
  return (data || []).map(nft => ({
    id: nft.id,
    name: nft.name,
    description: nft.description,
    image: nft.image_url,
    price: nft.price,
    royalty: nft.royalty,
    owner_id: nft.owner_id,
    chain: nft.attributes?.chain || 'eth',
    mintType: nft.attributes?.mintType || 'free'
  }))
}

export async function mintNFT({ name, description, royalty, image }) {
  // handled in MintForm.vue
  return true
}

export async function buyNFT(nft) {
  // TODO: Integrate with contract
  return true
}

export async function listNFT(nft, price) {
  await supabase.from('nfts').update({ price: price }).eq('id', nft.id)
  return true
}

export async function transferNFT(nft, toAddress) {
  await supabase.from('nfts').update({ owner_id: toAddress }).eq('id', nft.id)
  return true
}