import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
	id: string | string[]
	values?: {}
}

const T: React.FC<Props> = props => {
	const { id, values } = props

	return <FormattedMessage id={typeof id === 'string' ? id : id.join('.')} values={values} />
}

export default T
