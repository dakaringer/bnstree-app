import * as React from 'react'
import { Typography, Paper, FormControlLabel, Checkbox } from '@material-ui/core'

import PageContainer from '@src/components/PageContainer'

const Home = () => {
	return (
		<PageContainer>
			<Paper style={{ padding: '2rem' }}>
				<Typography variant="title" color="primary">
					Welcome to BnSTree Next
				</Typography>
				<Typography>This site is currently under construction.</Typography>
				<div style={{ marginTop: '2rem' }}>
					<Typography>Current Progress</Typography>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body2">Home</Typography>
						<FormControlLabel control={<Checkbox checked={false} />} label="Layout" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body2">News</Typography>
						<FormControlLabel control={<Checkbox checked={false} />} label="Basic Functionality" />
						<FormControlLabel control={<Checkbox checked={false} />} label="Skill/Item Data Integration" />
						<FormControlLabel control={<Checkbox checked={false} />} label="Editor" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body2">Character Search</Typography>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Basic Functionality"
						/>
						<FormControlLabel control={<Checkbox checked={true} color="primary" />} label="Stats" />
						<FormControlLabel control={<Checkbox checked={true} color="primary" />} label="Items" />
						<FormControlLabel control={<Checkbox checked={true} color="primary" />} label="Skills" />
						<FormControlLabel control={<Checkbox checked={false} />} label="New KR HM Point System" />
						<FormControlLabel control={<Checkbox checked={false} />} label="KR Gems" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body2">Skills</Typography>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Basic Functionality"
						/>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Skill Data (latest KR)"
						/>
						<FormControlLabel control={<Checkbox checked={true} color="primary" />} label="Search" />
						<FormControlLabel control={<Checkbox checked={false} />} label="Grid Mode" />
						<FormControlLabel control={<Checkbox checked={false} />} label="Sorting" />
						<FormControlLabel control={<Checkbox checked={false} />} label="Share/Import" />
						<FormControlLabel
							control={<Checkbox checked={false} />}
							label="Entirely New System for 9.19 Changes"
						/>
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body2">Items</Typography>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Basic Functionality"
						/>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Soul Badge Data (latest KR)"
						/>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Mystic Badge Data (latest KR)"
						/>
						<FormControlLabel control={<Checkbox checked={false} />} label="Soul Shield Data (latest KR)" />
						<FormControlLabel control={<Checkbox checked={false} />} label="Other items" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body2">Market</Typography>
						<FormControlLabel control={<Checkbox checked={false} />} label="Basic Functionality" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body2">Twitch</Typography>
						<FormControlLabel control={<Checkbox checked={false} />} label="Basic Functionality" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body2">Misc.</Typography>
						<FormControlLabel control={<Checkbox checked={false} />} label="Other Languages" />
					</div>
				</div>
			</Paper>
		</PageContainer>
	)
}

export default Home
