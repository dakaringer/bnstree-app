import * as React from 'react'
import { Select, MenuItem } from '@material-ui/core'

import * as style from './styles/index.css'

const regions = ['NA', 'EU', 'KR', 'TW']

interface Props {
	currentRegion: string
	onChange: (region: string) => void
}

const RegionSelector: React.SFC<Props> = props => {
	const { currentRegion, onChange } = props

	return (
		<Select
			classes={{
				root: style.select,
				select: style.selectButton
			}}
			onChange={event => onChange(event.target.value)}
			value={currentRegion}
			disableUnderline>
			{regions.map(region => (
				<MenuItem key={region} value={region} className={style.regionSelectorMenuItem}>
					{region}
				</MenuItem>
			))}
		</Select>
	)
}

export default React.memo(RegionSelector)
