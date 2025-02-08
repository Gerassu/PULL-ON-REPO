export function GetElementHeight(element) {
  // Get the computed styles for the ::before pseudo-element
  const beforeStyles = getComputedStyle(element, '::before');
  const afterStyles = getComputedStyle(element, '::after');

  return (element.offsetHeight + beforeStyles.height + afterStyles.height)
}