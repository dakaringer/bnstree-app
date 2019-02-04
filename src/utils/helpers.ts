import { get, merge, uniq } from 'lodash-es'
import { regions } from './constants'

import store from '@store/redux'

import { SkillData, SkillAttribute } from '@store/Skills'
import { selectors as intlSelectors } from '@store/Intl'
import { selectors as namesSelectors } from '@store/Names'

import tagDefs from './tagDefs'

export const getNameData = (name: string, group: string) => {
	const state = store.getState()
	const locale = intlSelectors.getLocale(state)
	const names = namesSelectors.getNames(state)

	const nameData = get(names, [group, name], null)
	if (!nameData) {
		console.error(`[BnSTree] Missing skill name data "${name}" in "${group}"`)
		return null
	}

	return {
		name: nameData.name[locale],
		icon: nameData.icon
	}
}

export const processSkillNameAndTags = (skillData: DeepReadonly<SkillData>): DeepReadonly<SkillData> => {
	const state = store.getState()

	const messages = intlSelectors.getMessages(state)
	const tagList: { [x: string]: string } = get(messages, ['skill', 'tag'], {})

	const nameData = getNameData(skillData.nameId, 'skill')

	return {
		...skillData,
		...nameData,
		tags: (skillData.tags || []).map(tag => tagList[tag])
	}
}

export const getTags = (skillData: DeepReadonly<Partial<SkillData>>) => {
	const state = store.getState()

	const messages = intlSelectors.getMessages(state)
	const tagList: { [x: string]: string } = get(messages, ['skill', 'tag'], {})

	const tags = skillData.tags ? [...skillData.tags] : []

	if (skillData.attributes) {
		skillData.attributes.forEach(attribute => {
			tagDefs.forEach(tagDef => {
				if (tagDef.test(attribute, skillData.attributes)) {
					tags.push(tagDef.tag)
				}
			})
		})
	}

	return uniq(tags)
		.map(tag => tagList[tag])
		.filter(tag => tag)
}

const mergeAttributes = (
	targetAttributes: DeepReadonlyArray<SkillAttribute> = [],
	traitAttributes: DeepReadonlyArray<SkillAttribute> = []
) => {
	return [
		...traitAttributes.filter(attb => !attb.modId),
		...targetAttributes
			.map(attb => {
				if (attb.modId) {
					const replacement = traitAttributes.filter(tAttb => attb.modId === tAttb.modId)
					if (replacement.length > 0) {
						return replacement
					}
				}
				return attb
			})
			.flat()
			.filter(attb => !attb.delete)
	]
}

export const mergeSkills = (
	targetSkillData: DeepReadonly<SkillData>,
	traitSkillData: Partial<DeepReadonly<SkillData>>
): DeepReadonly<SkillData> => {
	return {
		...targetSkillData,
		...traitSkillData,
		attributes: mergeAttributes(targetSkillData.attributes, traitSkillData.attributes),
		info: targetSkillData.info && merge({}, targetSkillData.info, traitSkillData.info),
		stance_change: mergeAttributes(targetSkillData.stance_change, traitSkillData.stance_change),
		requirements: mergeAttributes(targetSkillData.requirements, traitSkillData.requirements),
		tags: traitSkillData.tags
	}
}

export const getValidRegion = (region: string) => {
	return regions.includes(region) ? region : 'NA'
}
