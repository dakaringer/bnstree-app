import * as React from 'react'
import { classes, items } from '@src/constants'

export interface LinkObject {
	link: string
	label: string
	icon?: string
	subMenu?: LinkObject[]
	render?: (resetMenu: () => void) => React.ReactElement<any>
	disabled?: boolean
}

export const menuLinks: LinkObject[] = [
	{
		link: 'news',
		label: 'navigation.menu.news',
		disabled: true
	},
	{
		link: 'skills',
		label: 'navigation.menu.skills',
		subMenu: classes.map(c => {
			if (!['BD'].includes(c.classCode)) {
				return {
					...c,
					disabled: true
				}
			}
			return c
		})
	},
	{
		link: 'skills-legacy',
		label: 'navigation.menu.skills_legacy',
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
