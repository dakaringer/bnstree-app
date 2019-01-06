export type DeepReadonly<T> = T extends any[]
	? DeepReadonlyArray<T[number]>
	: T extends object
	? DeepReadonlyObject<T>
	: T
export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
export type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }

export type DeepPartial<T> = T extends any[] ? T : T extends object ? DeepPartialObject<T> : T
type DeepPartialObject<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>
