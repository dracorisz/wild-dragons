/**
 * Component Optimization Utilities
 * Collection of utilities for optimizing React components
 */

import { useMemo, useCallback, useRef, useEffect, useState, memo } from 'react';

/**
 * Hook to memoize expensive calculations with dependency tracking
 * @param {Function} computeFn - Expensive computation function
 * @param {Array} deps - Dependency array
 * @param {number} maxCacheSize - Maximum cache size (default: 10)
 */
export const useOptimizedComputation = (computeFn, deps, maxCacheSize = 10) => {
  const cacheRef = useRef(new Map());
  const keyRef = useRef(JSON.stringify(deps));

  const result = useMemo(() => {
    const newKey = JSON.stringify(deps);
    
    if (cacheRef.current.has(newKey)) {
      return cacheRef.current.get(newKey);
    }

    const computed = computeFn();
    
    if (cacheRef.current.size >= maxCacheSize) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }
    
    cacheRef.current.set(newKey, computed);
    return computed;
  }, deps);

  return result;
};

/**
 * Hook to debounce callback with cleanup
 */
export const useDebouncedCallback = (callback, delay, deps = []) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook for efficient list rendering with virtualization support
 */
export const useVirtualizedList = (items, itemHeight, containerHeight) => {
  const scrollTop = useRef(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

  useEffect(() => {
    const start = Math.floor(scrollTop.current / itemHeight);
    const end = Math.ceil((scrollTop.current + containerHeight) / itemHeight);
    setVisibleRange({ start, end: Math.min(end, items.length) });
  }, [itemHeight, containerHeight, items.length]);

  return {
    visibleRange,
    setScrollTop: (top) => { scrollTop.current = top; }
  };
};

/**
 * Hook for request deduplication
 */
export const useDedupedRequest = (requestFn, deps = []) => {
  const pendingRef = useRef(null);
  const resultRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const executeRequest = async () => {
      if (pendingRef.current) {
        return;
      }

      if (resultRef.current) {
        setData(resultRef.current);
        return;
      }

      try {
        setLoading(true);
        pendingRef.current = requestFn();
        const result = await pendingRef.current;
        resultRef.current = result;
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
        pendingRef.current = null;
      }
    };

    executeRequest();
  }, deps);

  return { data, loading, error };
};

/**
 * Hook for intersection-based lazy loading
 */
export const useIntersectionObserver = (elementRef, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        ...options
      }
    );

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return isVisible;
};

/**
 * Create a memoized component with shallow prop comparison
 */
export const createOptimizedComponent = (Component, propsComparer) => {
  return memo(Component, (prevProps, nextProps) => {
    if (propsComparer) {
      return propsComparer(prevProps, nextProps);
    }
    
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    
    if (prevKeys.length !== nextKeys.length) return false;
    
    return prevKeys.every(key => prevProps[key] === nextProps[key]);
  });
};

/**
 * Batch multiple state updates for better performance
 */
export const useBatchedState = (initialState) => {
  const [state, setState] = useState(initialState);
  const batchRef = useRef({});
  const flushTimeoutRef = useRef(null);

  const batchUpdate = useCallback((updates) => {
    Object.assign(batchRef.current, updates);

    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
    }

    flushTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, ...batchRef.current }));
      batchRef.current = {};
    }, 16); // ~60fps
  }, []);

  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
    };
  }, []);

  return [state, batchUpdate];
};

export default {
  useOptimizedComputation,
  useDebouncedCallback,
  useVirtualizedList,
  useDedupedRequest,
  useIntersectionObserver,
  createOptimizedComponent,
  useBatchedState
};
