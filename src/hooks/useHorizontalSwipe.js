import { useRef } from "react";

// A swipe has to travel this far horizontally to count...
const MIN_HORIZONTAL_DISTANCE = 50;
// ...and stay within this much vertical drift, so scrolling the page never
// changes the matchweek by accident.
const MAX_VERTICAL_DRIFT = 60;

/**
 * Touch handlers for swiping left/right over a block of content.
 * Spread the result onto the element: <Box {...swipeHandlers}>
 *
 * @param {Object} handlers
 * @param {Function} handlers.onSwipeLeft - swipe right-to-left (go forward)
 * @param {Function} handlers.onSwipeRight - swipe left-to-right (go back)
 */
export const useHorizontalSwipe = ({ onSwipeLeft, onSwipeRight }) => {
  const startPoint = useRef(null);

  const onTouchStart = (event) => {
    const touch = event.touches[0];
    startPoint.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event) => {
    if (!startPoint.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startPoint.current.x;
    const deltaY = touch.clientY - startPoint.current.y;
    startPoint.current = null;

    if (Math.abs(deltaY) > MAX_VERTICAL_DRIFT) return;
    if (Math.abs(deltaX) < MIN_HORIZONTAL_DISTANCE) return;

    if (deltaX < 0) {
      onSwipeLeft?.();
    } else {
      onSwipeRight?.();
    }
  };

  return { onTouchStart, onTouchEnd };
};
