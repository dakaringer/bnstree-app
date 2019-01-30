import React from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { MenuItem } from '@material-ui/core'
import { InputBaseComponentProps } from '@material-ui/core/InputBase'
import { regions } from '@utils/constants'
import { useCallback } from '@utils/hooks'

import { SearchInputComponent, RegionSelect, RegionSelectMenuItem } from './style'

interface SelfProps {
	inputProps: InputBaseComponentProps
	currentRegion: string
	onSubmit: (name: string) => void
	onRegionChange: (region: string) => void
}

interface SelfPropsWithRef extends SelfProps {
	inputRef: React.Ref<{}> | undefined
}

interface Props extends SelfPropsWithRef, InjectedIntlProps {}

const SearchInput: React.FC<Props> = props => {
	const { inputProps, intl, inputRef, currentRegion, onRegionChange, onSubmit } = props

	return (
		<form
			onSubmit={useCallback(event => {
				event.preventDefault()
				onSubmit(inputProps.value)
			})}>
			<SearchInputComponent
				placeholder={intl.formatMessage({ id: 'character.search_placeholder' })}
				inputRef={inputRef}
				inputProps={inputProps}
				endAdornment={
					<RegionSelect
						onChange={useCallback(event => onRegionChange(event.target.value))}
						value={currentRegion}>
						{regions.map(region => (
							<MenuItem key={region} value={region} component={RegionSelectMenuItem}>
								{region}
							</MenuItem>
						))}
					</RegionSelect>
				}
			/>
		</form>
	)
}

const SearchInputWithIntl = injectIntl<Props>(SearchInput)

export default React.forwardRef((props: SelfProps, ref) => {
	return <SearchInputWithIntl inputRef={ref} {...props} />
})
