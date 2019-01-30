import React from 'react'

import Attribute from '@components/AttributeLegacy'

import { ItemAttribute } from '@store/Items'

export default (attributes: DeepReadonlyArray<ItemAttribute>) => {
	const result = attributes.map(attribute => ({ attribute } as GetComponentProps<typeof Attribute>))

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
