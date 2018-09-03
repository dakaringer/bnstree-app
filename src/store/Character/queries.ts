import gql from 'graphql-tag'

export const searchCharacterQuery = gql`
	query characterSearch($name: String!, $region: CharacterRegion!) {
		character {
			data(name: $name, region: $region) {
				profile {
					... on ProfileFailed {
						failed
					}
					... on Profile {
						account
						region
						name
						classCode
						level
						server
						faction
						clan
						profileImg
						arena {
							stats
							solo {
								rating
								wins
							}
							tag {
								rating
								wins
							}
						}
					}
				}
				stats {
					base_ability
					equipped_ability
					total_ability
					point_ability
				}
				equipment
				skills {
					elementIndex
					pageName
					build
				}
				otherCharacters {
					account
					list
				}
				votes {
					count
					userVoted
				}
				badges {
					name
					grade
					icon
				}
			}
		}
	}
`
