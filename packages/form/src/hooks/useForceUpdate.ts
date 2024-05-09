import { useState, useCallback } from 'react';

export default function useForcedUpdate() {
	const [, setRenderKey] = useState<symbol>();
	const forcedUpdate = useCallback(() => setRenderKey(Symbol('forceUpdate')), []);
	return [forcedUpdate];
}
