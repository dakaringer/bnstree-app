import { ComponentType as Component, ComponentClass } from 'react'

interface ComponentEnhancer<TInner, TOutter> {
	(component: Component<TInner>): ComponentClass<TOutter>
}
export default <TInner, TOutter>(...funcs: Function[]): ComponentEnhancer<TInner, TOutter> =>
	<ComponentEnhancer<TInner, TOutter>>funcs.reduce((a, b) => (...args: any[]) => a(b(...args)), (arg: any) => arg)
