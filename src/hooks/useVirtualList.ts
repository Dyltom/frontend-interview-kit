import { useState } from 'react';

/**
 * Hook for virtualizing large lists to improve performance
 *
 * @example
 * ```tsx
 * const virtualList = useVirtualList({
 *   items: data,
 *   rowHeight: 50,
 *   containerHeight: 500,
 *   overscan: 3
 * });
 *
 * <div
 *   style={{ height: containerHeight, overflow: 'auto' }}
 *   onScroll={(e) => virtualList.onScroll(e.currentTarget.scrollTop)}
 * >
 *   <div style={{ height: virtualList.totalHeight, position: 'relative' }}>
 *     <div style={{ transform: `translateY(${virtualList.offsetY}px)` }}>
 *       {virtualList.visibleItems.map((item, i) => (
 *         <div key={virtualList.startIndex + i} style={{ height: rowHeight }}>
 *           {item}
 *         </div>
 *       ))}
 *     </div>
 *   </div>
 * </div>
 * ```
 */
export function useVirtualList<T>(options: {
  items: T[];
  rowHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const { items, rowHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * rowHeight;
  const offsetY = startIndex * rowHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    onScroll: (scrollTop: number) => setScrollTop(scrollTop),
  };
}