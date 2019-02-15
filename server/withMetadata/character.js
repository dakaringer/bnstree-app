const path = require('path')

const gql = require('graphql-tag')
const apollo = require('../apollo')
const { STATIC_SERVER } = require('../constants')

const BUILD_FOLDER = '../../dist'

const classElements = {
	BM: ['attack_attribute_fire_rate', 'attack_attribute_lightning_rate'],
	KF: ['attack_attribute_fire_rate', 'attack_attribute_wind_rate'],
	DE: ['attack_attribute_earth_rate', 'attack_attribute_void_rate'],
	FM: ['attack_attribute_fire_rate', 'attack_attribute_ice_rate'],
	AS: ['attack_attribute_lightning_rate', 'attack_attribute_void_rate'],
	SU: ['attack_attribute_wind_rate', 'attack_attribute_earth_rate'],
	BD: ['attack_attribute_wind_rate', 'attack_attribute_lightning_rate'],
	WL: ['attack_attribute_ice_rate', 'attack_attribute_void_rate'],
	SF: ['attack_attribute_ice_rate', 'attack_attribute_earth_rate'],
	GS: ['attack_attribute_fire_rate', 'attack_attribute_void_rate'],
	WR: ['attack_attribute_lightning_rate', 'attack_attribute_ice_rate']
}

const elements = {
	attack_attribute_fire_rate: 'Flame Dmg',
	attack_attribute_ice_rate: 'Frost Dmg',
	attack_attribute_wind_rate: 'Wind Dmg',
	attack_attribute_earth_rate: 'Earth Dmg',
	attack_attribute_lightning_rate: 'Lightning Dmg',
	attack_attribute_void_rate: 'Shadow Dmg'
}

const characterQuery = gql`
	query characterSearch($name: String!, $region: CharacterRegion!) {
		character {
			data(name: $name, region: $region) {
				profile {
					... on ProfileFailed {
						failed
					}
					... on Profile {
						region
						name
						classCode
						level
						server
					}
				}
				stats {
					total_ability
				}
				equipment
			}
		}
	}
`

const app = async (req, res) => {
	const name = req.params.name
	const region = req.params.region.toUpperCase()

	const characterMetadata = await apollo
		.query({
			query: characterQuery,
			variables: {
				name,
				region
			},
			fetchPolicy: 'network-only'
		})
		.then(response => {
			const characterData = response.data.character.data

			if (!characterData || !characterData.profile || characterData.profile.failed || !characterData.stats) {
				return null
			}

			const characterName = characterData.profile.name
			const characterLevel = `Level ${characterData.profile.level[0]}${characterData.profile.level[1] &&
				` • HM ${characterData.profile.level[1]}`}`
			const characterServer = `${characterData.profile.region.toUpperCase()}-${characterData.profile.server}`

			const AP = `AP: ${characterData.stats.total_ability.attack_power_value}`
			const CHR = `Crit Rate: ${characterData.stats.total_ability.attack_critical_rate}%`
			const CHD = `Crit Dmg: ${characterData.stats.total_ability.attack_critical_damage_rate}%`

			const ED = classElements[characterData.profile.classCode].reduce(
				(acc, element) => {
					const rate = characterData.stats.total_ability[element]
					if (rate === acc.rate) {
						return null
					} else if (rate > acc.rate) {
						return {
							rate: `${rate}%`,
							element: elements[element]
						}
					} else {
						return acc
					}
				},
				{ element: '', rate: 0 }
			)

			return {
				title: `${characterName} | ${characterLevel} | ${characterServer}`,
				image: `${STATIC_SERVER}/images/class/${characterData.profile.classCode}`,
				desc: `${AP} | ${CHR} | ${CHD}${ED ? ` | ${ED.element}: ${ED.rate}` : ''}`
			}
		})

	res.render(path.resolve(__dirname, BUILD_FOLDER, 'index.ejs'), { characterMetadata })
}

module.exports = app
