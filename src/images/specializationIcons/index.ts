import { ClassCode, SkillSpecialization } from '@src/store/constants'

import BD_TEMPEST from './JobStyle_Img_SwordMaster01.png'
import BD_FLASH from './JobStyle_Img_SwordMaster02.png'

const specializationIcons: { [c in ClassCode]: { [s in SkillSpecialization<c>]: any } } = {
	BM: { empty: null },
	KF: { empty: null },
	DE: { empty: null },
	FM: { empty: null },
	AS: { empty: null },
	SU: { empty: null },
	BD: {
		BD_TEMPEST,
		BD_FLASH
	},
	WL: { empty: null },
	SF: { empty: null },
	GS: { empty: null },
	WR: { empty: null }
}

export default specializationIcons
