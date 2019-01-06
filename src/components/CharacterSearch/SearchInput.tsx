import * as React from 'react'
import { Input } from '@material-ui/core'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import style from './styles/index.css'
import RegionSelector from './RegionSelector'

interface SelfProps {
	inputProps: any
	currentRegion: string
	onChange: (region: string) => void
}

interface SelfPropsWithRef extends SelfProps {
	inputRef: React.Ref<{}> | undefined
}

interface Props extends SelfPropsWithRef, InjectedIntlProps {}

class SearchInput extends React.PureComponent<Props> {
	render = () => {
		const { inputProps, intl, inputRef, ...regionSelectorProps } = this.props
		return (
			<Input
				type="search"
				margin="dense"
				placeholder={intl.formatMessage({ id: 'character.search_placeholder' })}
				inputRef={inputRef}
				inputProps={inputProps}
				disableUnderline
				classes={{
					root: style.inputContainer,
					input: style.characterSearchInput
				}}
				endAdornment={<RegionSelector {...regionSelectorProps} />}
			/>
		)
	}
}

const SearchInputWithIntl = injectIntl<Props>(SearchInput)

export default React.forwardRef((props: SelfProps, ref) => {
	return <SearchInputWithIntl inputRef={ref} {...props} />
})
