import { useState, useEffect } from 'react';

export default function useMedia(query: string, initialValue = false) {
  const [matches, setMatches] = useState(initialValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleMatchChange = (event: any) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleMatchChange);
    return () => mediaQuery.removeEventListener('change', handleMatchChange);
  }, [query]);

  return matches;
}
