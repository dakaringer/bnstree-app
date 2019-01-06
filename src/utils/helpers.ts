import { get } from 'lodash-es'

import { DeepReadonly } from '@src/utils/immutableHelper'
import store from '@src/store/redux'

import { SkillData } from '@src/store/Skills/types'

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

	const nameData = getNameData(skillData.name, 'skill')

	return {
		...skillData,
		...nameData,
		tags: (skillData.tags || []).map(tag => tagList[tag])
	}
}
