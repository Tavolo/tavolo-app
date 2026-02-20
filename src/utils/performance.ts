/**
 * Performance utilities for API calls and event handlers
 */

/**
 * Creates a debounced version of a function.
 * The function will only execute after `wait` ms have passed
 * without the function being called again.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Creates a throttled version of a function.
 * The function will execute at most once per `limit` ms.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Measures execution time of an async function.
 * Useful for performance monitoring.
 */
export async function measureAsync<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[perf] ${label}: ${duration.toFixed(2)}ms`);
    }
  }
}
