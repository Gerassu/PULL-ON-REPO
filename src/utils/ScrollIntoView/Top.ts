export default function ScrollIntoTopView(
  container: HTMLElement,
  element: HTMLElement,
  duration: number = 150, // Duration in milliseconds
  offset: number = 0 // Offset in pixels
) {
  // Get container and element dimensions
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  // Calculate the target scroll position with offset
  const targetScrollTop =
    elementRect.top - containerRect.top + container.scrollTop - offset;

  const startScrollTop = container.scrollTop;
  const distance = targetScrollTop - startScrollTop;
  const startTime = performance.now();

  function smoothScroll(currentTime: number) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1); // Progress between 0 and 1

    // Smooth cubic easing in-out
    const easing =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // Update container scroll position
    const newScrollTop = startScrollTop + distance * easing;
    container.scrollTop = newScrollTop;

    // Continue animation until complete
    if (progress < 1) {
      requestAnimationFrame(smoothScroll);
    }
  }

  requestAnimationFrame(smoothScroll);
}
