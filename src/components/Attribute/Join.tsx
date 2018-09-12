import * as React from 'react'

const Join = (list: React.ReactNode[], sep: string = ', ') => {
	return list.reduce((acc: any[], cur) => (acc.length === 0 ? acc.concat([cur]) : acc.concat([sep, cur])), [])
}

export default Join
