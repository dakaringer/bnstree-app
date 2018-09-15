declare module '*.css' {
	interface IClassNames {
		[className: string]: string
	}
	const classNames: IClassNames
	export = classNames
}
declare module '*.png'
declare module '*.svg'
declare module '*.gif'

declare module 'react-sprite-animator'
declare module 'i18next-fetch-backend'
declare module 'fuse.js'
declare module 'react-visibility-sensor'
