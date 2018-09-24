import * as React from 'react'
import classIcons from '@src/images/classIcons'

export interface LinkObject {
	link: string
	label: string
	icon?: string
	subMenu?: LinkObject[]
	render?: (resetMenu: () => void) => React.ReactElement<any>
	disabled?: boolean
}

export const classes = [
	{
		classCode: 'BM',
		link: 'blade-master',
		label: 'general.class_names.BM',
		icon: classIcons.BM
	},
	{
		classCode: 'KF',
		link: 'kung-fu-master',
		label: 'general.class_names.KF',
		icon: classIcons.KF
	},
	{
		classCode: 'DE',
		link: 'destroyer',
		label: 'general.class_names.DE',
		icon: classIcons.DE
	},
	{
		classCode: 'FM',
		link: 'force-master',
		label: 'general.class_names.FM',
		icon: classIcons.FM
	},
	{
		classCode: 'AS',
		link: 'assassin',
		label: 'general.class_names.AS',
		icon: classIcons.AS
	},
	{
		classCode: 'SU',
		link: 'summoner',
		label: 'general.class_names.SU',
		icon: classIcons.SU
	},
	{
		classCode: 'BD',
		link: 'blade-dancer',
		label: 'general.class_names.BD',
		icon: classIcons.BD
	},
	{
		classCode: 'WL',
		link: 'warlock',
		label: 'general.class_names.WL',
		icon: classIcons.WL
	},
	{
		classCode: 'SF',
		link: 'soul-fighter',
		label: 'general.class_names.SF',
		icon: classIcons.SF
	},
	{
		classCode: 'GS',
		link: 'gunslinger',
		label: 'general.class_names.GS',
		icon: classIcons.GS
	},
	{
		classCode: 'WR',
		link: 'warden',
		label: 'general.class_names.WR',
		icon: classIcons.WR
	}
]

export const items = [
	{
		itemType: 'SOULBADGE',
		link: 'soul-badges',
		label: 'general.item_types.SOULBADGE'
	},
	{
		itemType: 'MYSTICBADGE',
		link: 'mystic-badges',
		label: 'general.item_types.MYSTICBADGE'
	},
	{
		itemType: 'SOULSHIELD',
		link: 'soul-shields',
		label: 'general.item_types.SOULSHIELD',
		disabled: true
	}
]

export const menuLinks: LinkObject[] = [
	{
		link: 'news',
		label: 'navigation.menu.news',
		disabled: true
	},
	{
		link: 'skills',
		label: 'navigation.menu.skills',
		subMenu: classes
	},
	{
		link: 'items',
		label: 'navigation.menu.items',
		subMenu: items
	},
	{
		link: 'marketplace',
		label: 'navigation.menu.marketplace',
		disabled: true
	},
	{
		link: 'twitch',
		label: 'navigation.menu.twitch',
		disabled: true
	}
]
