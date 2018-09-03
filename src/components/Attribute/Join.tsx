import * as React from 'react'

const Join = (list: React.ReactNode[], sep: string = ', ') => {
	return list.reduce((prev: any[], curr) => (prev.length === 0 ? prev.concat([curr]) : prev.concat([sep, curr])), [])
}

export default Join
