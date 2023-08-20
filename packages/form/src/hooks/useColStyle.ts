import { useMemo } from 'react';

const useColStyle = (span?: number, offset?: number) => {
	const style = useMemo(() => {
		const spanValue = span ? `${(span / 24) * 100}%` : undefined;
		return {
			maxWidth: spanValue,
			marginInlineStart: offset ? `${(offset / 24) * 100}%` : undefined,
			flex: spanValue,
		};
	}, [span, offset]);
	return [style];
};
export default useColStyle;
