import React, { useState, useCallback, CSSProperties } from 'react';

interface VirtualListProps<T> {
  items: T[];
  rowHeight: number;
  height?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  rowHeight,
  height = 400,
  renderItem,
  overscan = 3,
  className = '',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop);
  }, []);

  // Calculate visible range
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + height) / rowHeight) + overscan
  );

  // Calculate offset for visible items
  const offsetY = Math.max(0, startIndex - overscan) * rowHeight;
  const visibleStartIndex = Math.max(0, startIndex - overscan);
  const visibleEndIndex = endIndex;

  const containerStyle: CSSProperties = {
    height,
    overflow: 'auto',
    position: 'relative',
  };

  const innerStyle: CSSProperties = {
    height: items.length * rowHeight,
    position: 'relative',
  };

  const itemsStyle: CSSProperties = {
    transform: `translateY(${offsetY}px)`,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  };

  return (
    <div
      className={`virtual-list ${className}`}
      style={containerStyle}
      onScroll={handleScroll}
      role="list"
      aria-rowcount={items.length}
    >
      <div style={innerStyle}>
        <div style={itemsStyle}>
          {items.slice(visibleStartIndex, visibleEndIndex).map((item, index) => {
            const actualIndex = visibleStartIndex + index;
            return (
              <div
                key={actualIndex}
                style={{
                  height: rowHeight,
                  position: 'absolute',
                  top: index * rowHeight,
                  left: 0,
                  right: 0,
                }}
                role="listitem"
                aria-posinset={actualIndex + 1}
                aria-setsize={items.length}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Hook version for more control
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