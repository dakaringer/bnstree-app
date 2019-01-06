import { SkillElement } from '@src/store/constants'

import FLAME from './SkillBook_AttributeIcon_02.png'
import FROST from './SkillBook_AttributeIcon_03.png'
import WIND from './SkillBook_AttributeIcon_06.png'
import EARTH from './SkillBook_AttributeIcon_01.png'
import LIGHTNING from './SkillBook_AttributeIcon_04.png'
import SHADOW from './SkillBook_AttributeIcon_05.png'

const elementIcons: { [key in SkillElement]: any } = {
	FLAME,
	FROST,
	WIND,
	EARTH,
	LIGHTNING,
	SHADOW
}

export default elementIcons
