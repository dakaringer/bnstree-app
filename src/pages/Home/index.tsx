import React from 'react'
import { Typography, Paper } from '@material-ui/core'

import PageContainer from '@components/PageContainer'

const HomePage = () => {
	return (
		<PageContainer>
			<Paper style={{ padding: '2rem' }}>
				<Typography variant="h6" color="primary">
					Welcome to BnSTree Next
				</Typography>
				<Typography>This site is currently under construction.</Typography>
			</Paper>
		</PageContainer>
	)
}

export default HomePage
