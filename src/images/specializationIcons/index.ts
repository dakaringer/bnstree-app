import { ClassCode, SkillSpecialization } from '@store'

import BM_BLAZEBLADE from './JobStyle_Img_BladeMaster01.png'
import BM_SWIFTBLADE from './JobStyle_Img_BladeMaster02.png'
import BM_SOULBLADE from './JobStyle_Img_BladeMaster03.png'
import BD_TEMPEST from './JobStyle_Img_SwordMaster01.png'
import BD_FLASH from './JobStyle_Img_SwordMaster02.png'
import WL_DISTORTION from './JobStyle_Img_Warlock01.png'
import WL_INFLICTION from './JobStyle_Img_Warlock02.png'

const specializationIcons: { [c in ClassCode]: { [s in SkillSpecialization<c>]: any } } = {
	BM: { BM_BLAZEBLADE, BM_SWIFTBLADE, BM_SOULBLADE },
	KF: { empty: null },
	DE: { empty: null },
	FM: { empty: null },
	AS: { empty: null },
	SU: { empty: null },
	BD: { BD_TEMPEST, BD_FLASH },
	WL: { WL_DISTORTION, WL_INFLICTION },
	SF: { empty: null },
	GS: { empty: null },
	WR: { empty: null }
}

export default specializationIcons
