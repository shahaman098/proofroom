import {useEffect, useRef} from 'react';

// Content is visible by default: unsupported observers or reduced motion never hide it.
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.classList.add('is-revealed');
        observer.disconnect();
      }
    }, {threshold: 0.15});
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return ref;
}
