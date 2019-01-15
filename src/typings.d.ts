declare const global: any

declare module '*.css' {
	interface IClassNames {
		[className: string]: string
	}
	const classNames: IClassNames
	export default classNames
}
declare module '*.png'
declare module '*.svg'
declare module '*.gif'

declare module 'react-sprite-animator'
declare module 'fuse.js'
declare module 'react-visibility-sensor'

type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never

type DeepReadonly<T> = T extends any[] ? DeepReadonlyArray<T[number]> : T extends object ? DeepReadonlyObject<T> : T
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }

type DeepPartial<T> = T extends any[] ? T : T extends object ? DeepPartialObject<T> : T
type DeepPartialObject<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>

type GetComponentProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never
