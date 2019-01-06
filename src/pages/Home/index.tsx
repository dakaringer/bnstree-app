import * as React from 'react'
import { Typography, Paper, FormControlLabel, Checkbox } from '@material-ui/core'

import PageContainer from '@src/components/PageContainer'

const Home = () => {
	return (
		<PageContainer>
			<Paper style={{ padding: '2rem' }}>
				<Typography variant="h6" color="primary">
					Welcome to BnSTree Next
				</Typography>
				<Typography>This site is currently under construction.</Typography>
				<div style={{ marginTop: '2rem' }}>
					<Typography>Current Progress</Typography>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body1">Home</Typography>
						<FormControlLabel control={<Checkbox checked={false} />} label="Layout" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body1">News</Typography>
						<FormControlLabel control={<Checkbox checked={false} />} label="Basic Functionality" />
						<FormControlLabel control={<Checkbox checked={false} />} label="Skill/Item Data Integration" />
						<FormControlLabel control={<Checkbox checked={false} />} label="Editor" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body1">Character Search</Typography>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Basic Functionality"
						/>
						<FormControlLabel control={<Checkbox checked={true} color="primary" />} label="Stats" />
						<FormControlLabel control={<Checkbox checked={true} color="primary" />} label="Items" />
						<FormControlLabel control={<Checkbox checked={true} color="primary" />} label="Skills" />
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="New KR HM Point System"
						/>
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body1">Skills</Typography>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Basic Functionality"
						/>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Skill Data (July 11 KR)"
						/>
						<FormControlLabel control={<Checkbox checked={true} color="primary" />} label="Search" />
						<FormControlLabel control={<Checkbox checked={false} />} label="Grid Mode" />
						<FormControlLabel control={<Checkbox checked={false} />} label="Share/Import" />
						<FormControlLabel
							control={<Checkbox checked={true} indeterminate />}
							label="Skill Specialization & Traits (aka Awakening)"
						/>
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body1">Items</Typography>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Basic Functionality"
						/>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Soul Badge Data (July 11 KR)"
						/>
						<FormControlLabel
							control={<Checkbox checked={true} color="primary" />}
							label="Mystic Badge Data (July 11 KR)"
						/>
						<FormControlLabel
							control={<Checkbox checked={false} />}
							label="Soul Shield Data (July 11 KR)"
						/>
						<FormControlLabel control={<Checkbox checked={false} />} label="Other items" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body1">Market</Typography>
						<FormControlLabel control={<Checkbox checked={false} />} label="Basic Functionality" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body1">Twitch</Typography>
						<FormControlLabel control={<Checkbox checked={false} />} label="Basic Functionality" />
					</div>
					<div style={{ marginTop: '1rem' }}>
						<Typography variant="body1">Misc.</Typography>
						<FormControlLabel control={<Checkbox checked={false} />} label="Other Languages" />
					</div>
				</div>
			</Paper>
		</PageContainer>
	)
}

export default Home
