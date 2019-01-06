export interface Names {
	data: {
		[type: string]: {
			[id: string]: {
				name: {
					[locale: string]: string
				}
				icon: string
			}
		}
	}
}
