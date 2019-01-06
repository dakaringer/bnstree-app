import { merge } from 'lodash-es'

import { DeepReadonly, DeepReadonlyArray } from '@src/utils/immutableHelper'
import { SkillData, SkillAttribute } from '@src/store/Skills/types'

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
					if (replacement.length > 0) return replacement
				}
				return attb
			})
			.flat()
			.filter(attb => !attb.delete)
	]
}

export default (
	targetSkillData: DeepReadonly<SkillData>,
	traitSkillData: DeepReadonly<Partial<SkillData>>
): DeepReadonly<SkillData> => {
	return {
		...targetSkillData,
		...traitSkillData,
		attributes: mergeAttributes(targetSkillData.attributes, traitSkillData.attributes),
		info: merge({}, targetSkillData.info, traitSkillData.info),
		stance_change: mergeAttributes(targetSkillData.stance_change, traitSkillData.stance_change),
		requirements: mergeAttributes(targetSkillData.requirements, traitSkillData.requirements)
	}
}
