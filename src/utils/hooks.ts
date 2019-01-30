import { useRef, useCallback as useReactCallback } from 'react'

export const useCallback = <T extends (...args: any[]) => any>(callback: T): T => {
	const ref = useRef<T>((() => null) as T)

	ref.current = callback

	return useReactCallback(((...args) => ref.current(...args)) as T, [])
}
