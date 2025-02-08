const containerRects = new WeakMap<HTMLElement, { container: DOMRect; elements: Map<HTMLElement, DOMRect> }>();

export default function ScrollIntoCenterView(
  container: HTMLElement,
  element: HTMLElement,
  duration: number = 150, // Duration in milliseconds
  offset: number = 0, // Offset in pixels, defaults to 0
) {
  function resetContainerData(container: HTMLElement) {
    containerRects.delete(container);
  }

  // Observe changes in the container
  const observer = new MutationObserver(() => {
    resetContainerData(container);
  });

  observer.observe(container, { childList: true, subtree: true });

  // Handle container resize
  const resizeObserver = new ResizeObserver(() => {
    resetContainerData(container);
  });

  resizeObserver.observe(container);

  // Retrieve or initialize data for the container
  let containerData = containerRects.get(container);

  if (!containerData) {
    containerData = {
      container: container.getBoundingClientRect(),
      elements: new Map(),
    };
    containerRects.set(container, containerData);
  }

  const containerRect = containerData.container;

  // Fetch or calculate the bounding rect for the target element
  let elementRect = containerData.elements.get(element);
  if (!elementRect) {
    elementRect = element.getBoundingClientRect();
    containerData.elements.set(element, elementRect);
  }

  // Calculate the target scroll position with the offset
  const targetScrollTop =
    elementRect.top - containerRect.top + container.scrollTop -
    (container.clientHeight / 2 - element.clientHeight / 2) -
    offset; // Apply the offset

  const startScrollTop = container.scrollTop;
  const distance = targetScrollTop - startScrollTop;
  const startTime = performance.now();

  function smoothScroll(currentTime: number) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1); // Progress between 0 and 1
    const easing = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2; // Smooth cubic easing in-out
    const newScrollTop = startScrollTop + distance * easing;

    container.scrollTop = newScrollTop;

    if (progress < 1) {
      requestAnimationFrame(smoothScroll);
    }
  }

  requestAnimationFrame(smoothScroll);

  // Cleanup observers when done (optional, depending on lifecycle requirements)
  setTimeout(() => {
    observer.disconnect();
    resizeObserver.disconnect();
  }, duration);
}
