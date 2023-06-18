import { useState, useCallback, useMemo } from 'react';

export default function useForcedUpdate() {
	const [, setRenderKey] = useState<symbol>();
	const forcedUpdate = useCallback(() => setRenderKey(Symbol('forceUpdate')), []);
	return useMemo(() => [forcedUpdate], [forcedUpdate]);
}
