import { SkillSpecialization, ClassCode } from '@src/store/constants'

const specializations: { [c in ClassCode]: SkillSpecialization<c>[] } = {
	BM: ['empty'],
	KF: ['empty'],
	DE: ['empty'],
	FM: ['empty'],
	AS: ['empty'],
	SU: ['empty'],
	BD: ['BD_TEMPEST', 'BD_FLASH'],
	WL: ['empty'],
	SF: ['empty'],
	GS: ['empty'],
	WR: ['empty']
}

export default specializations
