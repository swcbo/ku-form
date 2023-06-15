import { useState, useCallback, useMemo } from 'react';

export default function useForcedUpdate() {
  const [renderKey, setRenderKey] = useState<Symbol>();
  const forcedUpdate = useCallback(() => setRenderKey(Symbol('forceUpdate')), []);
  return useMemo(() => [forcedUpdate], [renderKey, forcedUpdate]);
}
