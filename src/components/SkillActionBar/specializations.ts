import { SkillSpecialization, ClassCode } from '@store'

const specializations: { [c in ClassCode]: SkillSpecialization<c>[] } = {
	BM: ['BM_BLAZEBLADE', 'BM_SWIFTBLADE', 'BM_SOULBLADE'],
	KF: ['empty'],
	DE: ['empty'],
	FM: ['empty'],
	AS: ['empty'],
	SU: ['empty'],
	BD: ['BD_TEMPEST', 'BD_FLASH'],
	WL: ['WL_DISTORTION', 'WL_INFLICTION'],
	SF: ['empty'],
	GS: ['empty'],
	WR: ['empty']
}

export default specializations
