import { useEffect, useState, useRef, useCallback as useReactCallback } from 'react'

export const useCallback = <T extends (...args: any[]) => any>(callback: T): T => {
	const ref = useRef<T>((() => null) as T)

	ref.current = callback

	return useReactCallback(((...args) => ref.current(...args)) as T, [])
}

export const useDebounce = (value: any, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}
