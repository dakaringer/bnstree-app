import * as React from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { MenuItem } from '@material-ui/core'
import { InputBaseComponentProps } from '@material-ui/core/InputBase'

import { SearchInputComponent, RegionSelect, RegionSelectMenuItem } from './style'

const regions = ['NA', 'EU', 'KR', 'TW']

interface SelfProps {
	inputProps: InputBaseComponentProps
	currentRegion: string
	onRegionChange: (region: string) => void
}

interface SelfPropsWithRef extends SelfProps {
	inputRef: React.Ref<{}> | undefined
}

interface Props extends SelfPropsWithRef, InjectedIntlProps {}

class SearchInput extends React.PureComponent<Props> {
	render = () => {
		const { inputProps, intl, inputRef, currentRegion, onRegionChange } = this.props
		return (
			<SearchInputComponent
				placeholder={intl.formatMessage({ id: 'character.search_placeholder' })}
				inputRef={inputRef}
				inputProps={inputProps}
				endAdornment={
					<RegionSelect onChange={event => onRegionChange(event.target.value)} value={currentRegion}>
						{regions.map(region => (
							<MenuItem key={region} value={region} component={RegionSelectMenuItem}>
								{region}
							</MenuItem>
						))}
					</RegionSelect>
				}
			/>
		)
	}
}

const SearchInputWithIntl = injectIntl<Props>(SearchInput)

export default React.forwardRef((props: SelfProps, ref) => {
	return <SearchInputWithIntl inputRef={ref} {...props} />
})
