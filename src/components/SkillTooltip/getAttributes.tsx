import React from 'react'
import { get, concat, isEqual } from 'lodash-es'

import Attribute from '@components/Attribute'

import { SkillSpecialization, ClassCode } from '@store'
import { SkillAttribute } from '@store/Skills'

export default (
	currentAttributeList: DeepReadonlyArray<SkillAttribute>,
	hoverAttributeList: DeepReadonlyArray<SkillAttribute>,
	defaultSpecialization: SkillSpecialization<ClassCode>,
	defaultIcon?: string
) => {
	const currentAttributes = currentAttributeList.filter(attribute =>
		concat(get(attribute, 'specialization', defaultSpecialization)).includes(defaultSpecialization)
	)
	const hoverAttributes = hoverAttributeList.filter(attribute =>
		concat(get(attribute, 'specialization', defaultSpecialization)).includes(defaultSpecialization)
	)

	const result = hoverAttributes
		.map(hoverAttribute => {
			const matchIndex = currentAttributes.findIndex(currentAttribute =>
				isEqualAttribute(hoverAttribute, currentAttribute)
			)
			const match = currentAttributes[matchIndex]
			if (match && get(match, 'values.scale', null) === get(hoverAttribute, 'values.scale', null)) {
				currentAttributes.splice(matchIndex, 1)
			}

			const attributeObject: GetComponentProps<typeof Attribute> = {
				attribute: hoverAttribute,
				defaultIcon
			}

			if (!match) {
				attributeObject.flag = 'add'
			} else if (!isEqual(match.values, hoverAttribute.values)) {
				attributeObject.flag = 'mod'
				attributeObject.moddedAttribute = match
			}

			return attributeObject
		})
		.concat(
			currentAttributes.map(leftoverAttribute => {
				const attributeObject: GetComponentProps<typeof Attribute> = {
					attribute: leftoverAttribute,
					flag: 'del',
					defaultIcon
				}
				return attributeObject
			})
		)

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

const isEqualAttribute = (a: SkillAttribute, b: SkillAttribute) => {
	if (a.msg !== b.msg) {
		return false
	}
	if (!a.values && !b.values) {
		return true
	}
	if (!a.values || !b.values) {
		return false
	}

	if (!isEqual(Object.keys(a.values), Object.keys(b.values))) {
		return false
	}

	for (const key in a.values) {
		if (typeof a.values[key] !== 'number' && !isEqual(a.values[key], b.values[key])) {
			return false
		}
	}

	return true
}
