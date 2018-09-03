import * as React from 'react'
import Attribute, { SelfProps as AttributeProps } from '@src/components/Attribute'

import { DeepReadonlyArray } from '@src/utils/immutableHelper'
import { ItemAttribute } from '@src/store/Items/types'

const Attributes = (attributes: DeepReadonlyArray<ItemAttribute>) => {
	const result: AttributeProps[] = attributes.map(attribute => ({ attribute } as AttributeProps))

	const m1 = result
		.filter(props => props.attribute.group === 'm1')
		.map((props, i) => <Attribute key={`${props.attribute.msg}-${i}`} {...props} />)
	const m2 = result
		.filter(props => props.attribute.group === 'm2')
		.map((props, i) => <Attribute key={`${props.attribute.msg}-${i}`} {...props} />)
	const sub = result
		.filter(props => !props.attribute.group)
		.map((props, i) => <Attribute key={`${props.attribute.msg}-${i}`} {...props} />)
	return { m1, m2, sub }
}

export default Attributes
