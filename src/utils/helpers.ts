import { get, merge, uniq } from 'lodash-es'

import store from '@store/redux'

import { SkillData, SkillAttribute } from '@store/Skills'

import tagDefs from './tagDefs'

export const getNameData = (name: string, group: string) => {
	const state = store.getState()
	const locale = state.user.preferences.locale
	const names = state.names.data

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

	const messages = state.intl.messages
	const locale = state.user.preferences.locale
	const tagList: { [x: string]: string } = get(messages, [locale, 'skill', 'tag'], {})

	const nameData = getNameData(skillData.nameId, 'skill')

	return {
		...skillData,
		...nameData,
		tags: (skillData.tags || []).map(tag => tagList[tag])
	}
}

export const getTags = (skillData: DeepReadonly<Partial<SkillData>>) => {
	const state = store.getState()

	const messages = state.intl.messages
	const locale = state.user.preferences.locale
	const tagList: { [x: string]: string } = get(messages, [locale, 'skill', 'tag'], {})

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
	const t1 = targetSkillData.tags || []
	const t2 = targetSkillData.tags || []
	return {
		...targetSkillData,
		...traitSkillData,
		attributes: mergeAttributes(targetSkillData.attributes, traitSkillData.attributes),
		info: targetSkillData.info && merge({}, targetSkillData.info, traitSkillData.info),
		stance_change: mergeAttributes(targetSkillData.stance_change, traitSkillData.stance_change),
		requirements: mergeAttributes(targetSkillData.requirements, traitSkillData.requirements),
		tags: uniq([...t1, ...t2])
	}
}
