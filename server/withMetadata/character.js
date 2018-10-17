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
	WR: ['attack_attribute_lightning_rate', 'attack_attribute_frost_rate']
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
			const character = response.data.character.data

			if (!character || character.profile.failed) {
				return null
			}

			const characterName = character.profile.name
			const characterLevel = `Level ${character.profile.level[0]}${character.profile.level[1] &&
				` • HM ${character.profile.level[1]}`}`
			const characterServer = `${character.profile.region.toUpperCase()}-${character.profile.server}`

			const AP = `AP: ${character.stats.total_ability.attack_power_value}`
			const CHR = `CHR: ${character.stats.total_ability.attack_critical_rate}`
			const CHD = `CHD: ${character.stats.total_ability.attack_critical_damage_rate}`

			const ED = classElements[character.profile.classCode].reduce(
				(acc, element) => {
					const rate = character.stats.total_ability[element]
					if (rate === acc.rate) {
						return null
					} else if (rate > acc.rate) {
						return {
							rate,
							element: elements[element]
						}
					} else {
						return acc
					}
				},
				{ element: '', rate: 0 }
			)

			console.log(ED)

			return {
				title: `${characterName} | ${characterLevel} | ${characterServer}`,
				image: `${STATIC_SERVER}/images/class/${character.profile.classCode}`,
				desc: `${AP} | ${CHR} | ${CHD}${ED && ` | ${ED.element}: ${ED.rate}`}`
			}
		})

	res.render(path.resolve(__dirname, BUILD_FOLDER, 'index.ejs'), { characterMetadata })
}

module.exports = app
