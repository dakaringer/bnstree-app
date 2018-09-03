import gql from 'graphql-tag'

export const loadPreferencesQuery = gql`
	query userPreferences {
		user {
			preferences {
				skills {
					mode
					order
					visibility
					element
					build
				}
				character {
					region
				}
				items {
					filter
				}
				market {
					region
				}
				locale
			}
		}
	}
`

export const idTokenLoginMutation = gql`
	mutation loginIdToken($idToken: String!) {
		user {
			login {
				withIdToken(idToken: $idToken) {
					displayName
					profileImg
					permissions
				}
			}
		}
	}
`

export const userTokenLoginMutation = gql`
	mutation loginUserToken {
		user {
			login {
				withUserToken {
					displayName
					profileImg
					permissions
				}
			}
		}
	}
`

export const logoutMutation = gql`
	mutation logout {
		user {
			logout
		}
	}
`

export const updatePreferencesMutation = gql`
	mutation updateUserPreferences($preferences: UserPreferencesInput!) {
		user {
			preferences {
				updatePreferences(preferences: $preferences)
			}
		}
	}
`
