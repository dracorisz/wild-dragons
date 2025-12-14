# Wild Dragons Data Service Documentation

## Overview

The Wild Dragons NFT Marketplace implements a comprehensive data layer with multiple storage strategies, caching mechanisms, and data normalization. This document outlines the data service architecture and API.

## Architecture Overview

### Data Layer Components

1. **useNFTData Composable** - Vue 3 composable for NFT data management
2. **DataManager Class** - Advanced client-side data management system
3. **Storage Strategies** - Multiple storage backends with automatic fallbacks
4. **Caching System** - Intelligent caching with TTL and LRU eviction
5. **Data Normalization** - Unified data format across different sources

### Data Flow

```
API Sources → Data Normalization → Caching → Vue Components
     ↓
Fallback Data → Error Handling → User Feedback
```

## useNFTData Composable

### Overview

The `useNFTData` composable provides a centralized interface for NFT data operations, including fetching, filtering, caching, and error handling.

### Reactive State

```javascript
const {
  collections,    // Available NFT collections
  nfts,          // All loaded NFTs
  loading,       // Loading state
  error          // Error state
} = useNFTData();
```

### Core Methods

#### fetchCollections()
Fetches the master collection index from `/meta/index.json`.

```javascript
const collections = await fetchCollections();
// Returns: { 'dragons': { name: 'Wild Dragons', item_count: 12 }, ... }
```

#### fetchAllNFTs()
Fetches all NFTs from all collections with caching.

```javascript
const allNFTs = await fetchAllNFTs();
// Returns: Array of normalized NFT objects
```

#### fetchCollectionNFTs(collectionId)
Fetches NFTs for a specific collection.

```javascript
const dragonNFTs = await fetchCollectionNFTs('dragons');
// Returns: Array of NFT objects for the dragons collection
```

#### filterNFTs(filters)
Creates a computed property for filtered NFT results.

```javascript
const filteredNFTs = filterNFTs({
  collection: 'dragons',
  elements: ['Fire', 'Water'],
  rarities: ['Epic', 'Legendary'],
  searchTerm: 'dragon',
  minPrice: 0.5,
  maxPrice: 2.0
});
```

#### getNFTById(nftId)
Retrieves a specific NFT by ID.

```javascript
const nft = getNFTById('dragons_1');
// Returns: Single NFT object or undefined
```

#### refreshData()
Clears cache and refetches all data.

```javascript
await refreshData();
// Forces fresh data load
```

### Data Normalization

#### NFT Object Structure

```javascript
{
  id: "dragons_1",
  name: "Fire Dragon Warrior",
  collection: "Wild Dragons",
  description: "A powerful fire element dragon...",
  image: {
    thumbnail: "/assets/dragons/dragons_1_thumb.png",
    preview: "/assets/dragons/dragons_1_preview.png",
    full: "/assets/dragons/dragons_1.png"
  },
  traits: {
    rarity: "Epic",
    element: "Fire",
    power: 85
  },
  spiritual: {
    chakra: "root",
    frequency_hz: 396,
    color: "red",
    level_unlock: 2
  },
  price: {
    listed: "1.25 ETH",
    floor: "1.00 ETH",
    last_sale: "0.90 ETH"
  }
}
```

#### normalizeNFTData(rawData)
Normalizes data from different API formats to unified structure.

#### validateNFTData(nft)
Validates NFT object structure and required fields.

### Caching Strategy

#### Cache Configuration
- **TTL**: 15 minutes for API responses
- **Max Size**: 100 cache entries
- **LRU Eviction**: Automatic cleanup of oldest entries

#### Cache Keys
- `collections` - Collection index
- `collection_{id}` - Individual collection data
- `allNFTs` - Combined NFT data

### Error Handling

#### Fallback Mechanisms
1. **Network Failure**: Automatic fallback to cached data
2. **API Error**: Graceful degradation with mock data
3. **Data Corruption**: Validation and filtering of invalid items

#### Error States
```javascript
// Reactive error state
if (error.value) {
  console.error('Data loading failed:', error.value);
  // Show user-friendly error message
}
```

## DataManager Class

### Overview

The `DataManager` class provides advanced client-side data management with multiple storage backends, compression, and performance monitoring.

### Storage Backends

#### IndexedDB (Primary)
- **Purpose**: Persistent client-side storage
- **Features**: Transactions, indexing, large data sets
- **Fallback**: Automatic fallback to localStorage

#### localStorage (Fallback)
- **Purpose**: Simple key-value storage
- **Limitations**: 5-10MB storage limit, synchronous
- **Usage**: Small data sets and configuration

#### SessionStorage (Temporary)
- **Purpose**: Session-specific data
- **Lifetime**: Cleared when tab/window closes

#### Memory Cache (Performance)
- **Purpose**: Fast in-memory access
- **Features**: LRU eviction, TTL support

### Core Methods

#### store(key, data, options)
Stores data with optional compression and encryption.

```javascript
await dataManager.store('userPreferences', userPrefs, {
  compress: true,
  encrypt: false
});
```

#### retrieve(key, options)
Retrieves data with automatic decompression/decryption.

```javascript
const data = await dataManager.retrieve('userPreferences', {
  decompress: true,
  decrypt: false
});
```

#### query(storeName, query)
Performs indexed queries on stored data.

```javascript
const rareNFTs = await dataManager.query('nfts', {
  rarity: 'Rare',
  element: (el) => ['Fire', 'Water'].includes(el)
});
```

#### delete(key)
Removes data from all storage backends.

```javascript
await dataManager.delete('oldCacheEntry');
```

### Performance Features

#### Compression
- **LZ-String**: Advanced compression for large datasets
- **Fallback**: Base64 encoding for basic compression
- **Automatic**: Enabled by default for data >1KB

#### Caching
- **LRU Cache**: Least Recently Used eviction
- **TTL Support**: Time-based expiration
- **Size Limits**: Automatic cleanup when limits exceeded

#### Monitoring
```javascript
const metrics = dataManager.getPerformanceMetrics();
// Returns: reads, writes, cache hits, compression ratio, storage used
```

### Auto-Optimization

#### Background Cleanup
- **Interval**: Every 5 minutes
- **Tasks**: Cache cleanup, index maintenance, storage compaction
- **Thresholds**: Automatic cleanup when storage >80% capacity

#### Storage Management
- **Quota Monitoring**: Warns when approaching storage limits
- **Aggressive Cleanup**: Removes old data when quota exceeded
- **Compression**: Automatic recompression of stored data

### Data Synchronization

#### Offline Support
- **Queue Operations**: Queues changes for later sync
- **Conflict Resolution**: Automatic conflict detection
- **Background Sync**: Syncs when connection restored

#### Export/Import
```javascript
// Export all data
const exportData = await dataManager.exportData();

// Import data
await dataManager.importData(exportData);
```

## API Integration

### Collection Data Structure

```javascript
// /meta/index.json
{
  "collections": {
    "dragons": {
      "name": "Wild Dragons",
      "item_count": 12,
      "file": "/data/collections/dragons.json"
    },
    "cosmic": {
      "name": "Cosmic Creatures",
      "item_count": 8,
      "file": "/data/collections/cosmic.json"
    }
  }
}
```

### Individual Collection Format

```javascript
// /data/collections/dragons.json
[
  {
    "id": "dragons_1",
    "name": "Fire Dragon Warrior",
    "collection": "Wild Dragons",
    // ... normalized NFT data
  }
  // ... more NFTs
]
```

## Error Handling Patterns

### Network Errors
```javascript
try {
  const data = await fetchAllNFTs();
} catch (error) {
  console.error('Network error:', error);
  // Automatic fallback to cached/mock data
}
```

### Data Validation Errors
```javascript
const validNFTs = rawData
  .map(normalizeNFTData)
  .filter(validateNFTData);
```

### Storage Errors
```javascript
// Automatic quota management
if (error.name === 'QuotaExceededError') {
  await dataManager.performAggressiveCleanup();
}
```

## Performance Optimization

### Caching Strategies
1. **API Response Caching**: 15-minute TTL for API data
2. **Computed Properties**: Vue computed for reactive filtering
3. **Memory Cache**: Fast access for frequently used data

### Storage Optimization
1. **Compression**: Automatic compression for large datasets
2. **Indexing**: Automatic indexing for query performance
3. **Cleanup**: Background cleanup of old/unused data

### Loading Optimization
1. **Progressive Loading**: Load collections first, then individual NFTs
2. **Lazy Loading**: Load NFT details on demand
3. **Background Updates**: Refresh cache in background

## Testing and Quality Assurance

### Data Validation
- **Schema Validation**: Ensures data structure compliance
- **Type Checking**: Validates data types and required fields
- **Sanitization**: Cleans and normalizes input data

### Performance Testing
- **Load Testing**: Tests with large datasets
- **Memory Testing**: Monitors memory usage and leaks
- **Cache Testing**: Validates cache hit rates and eviction

### Error Testing
- **Network Failure**: Tests offline functionality
- **Storage Failure**: Tests fallback storage mechanisms
- **Data Corruption**: Tests data recovery and validation

## Migration and Updates

### Data Schema Updates
1. **Version Detection**: Automatic detection of data format versions
2. **Migration Scripts**: Automatic data transformation
3. **Backward Compatibility**: Support for legacy data formats

### Storage Migration
1. **IndexedDB Migration**: Automatic migration between versions
2. **Data Export/Import**: Manual migration capabilities
3. **Fallback Handling**: Graceful degradation during migration

## Monitoring and Analytics

### Performance Metrics
- **Read/Write Operations**: Tracks data access patterns
- **Cache Hit Rates**: Monitors caching effectiveness
- **Storage Usage**: Tracks storage consumption
- **Error Rates**: Monitors failure rates

### Logging and Debugging
- **Operation Logging**: Detailed logs for troubleshooting
- **Performance Profiling**: Identifies bottlenecks
- **Error Tracking**: Comprehensive error reporting

## Future Enhancements

### Planned Features
- **Real-time Sync**: WebSocket-based real-time updates
- **Advanced Queries**: Complex query support with indexing
- **Data Encryption**: End-to-end encryption for sensitive data
- **Backup/Restore**: Cloud backup and restore capabilities

### Scalability Improvements
- **Sharding**: Data partitioning for large datasets
- **CDN Integration**: Distributed data caching
- **Progressive Web App**: Enhanced offline capabilities

## Conclusion

The Wild Dragons data service provides a robust, scalable foundation for NFT data management with comprehensive error handling, caching, and performance optimization. The architecture supports multiple storage backends, automatic fallbacks, and seamless integration with Vue 3 reactive system.