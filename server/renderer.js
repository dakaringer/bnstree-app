const path = require("path")
const fs = require("fs")

const gql = require('graphql-tag')
const gqlClient = require('./apollo')

const characterQuery = gql`
    query($name: String!, $region: String!) {
        Character(name: $name, region: $region) {
            general 
            statData: stats
        }
    }
`

const classElements = {
    BM: ['attack_attribute_fire_value', 'attack_attribute_lightning_value'],
    KF: ['attack_attribute_fire_value', 'attack_attribute_wind_value'],
    DE: ['attack_attribute_earth_value', 'attack_attribute_void_value'],
    FM: ['attack_attribute_fire_value', 'attack_attribute_ice_value'],
    AS: ['attack_attribute_lightning_value', 'attack_attribute_void_value'],
    SU: ['attack_attribute_wind_value', 'attack_attribute_earth_value'],
    BD: ['attack_attribute_wind_value', 'attack_attribute_lightning_value'],
    WL: ['attack_attribute_ice_value', 'attack_attribute_void_value'],
    SF: ['attack_attribute_ice_value', 'attack_attribute_earth_value'],
    SH: ['attack_attribute_fire_value', 'attack_attribute_void_value']
}

const elements = {
    attack_attribute_fire_value: 'Flame DMG',
    attack_attribute_ice_value: 'Frost DMG',
    attack_attribute_wind_value: 'Wind DMG',
    attack_attribute_earth_value: 'Earth DMG',
    attack_attribute_lightning_value: 'Lightning DMG',
    attack_attribute_void_value: 'Shadow DMG'
}

export default async (req, res, next) => {
    let name = req.params.name
    let region = req.params.region

    let buildPath = process.env.NODE_ENV === 'production' ? 'build_final' : 'build'
    const filePath = path.resolve(__dirname, '..', buildPath, 'index.html')


    let metadata = await new Promise((resolve, reject) => {
        gqlClient
            .query({
                query: characterQuery,
                variables: {
                    name: name,
                    region: region
                }
            }).then(json => {
                let character = json.data.Character
                if (!character.notFound) {
                    let desc = ''
                    desc += `Level: ${character.general.level[0]}${character.general.level[1] ? ` • HM ${character.general.level[1]}` : ''} | `
                    desc += `AP: ${character.statData.total_ability.attack_power_value} | `
                    desc += `CHR: ${character.statData.total_ability.attack_critical_rate}% | `
                    desc += `CHD: ${character.statData.total_ability.attack_critical_damage_rate}% | `

                    classElements[character.general.classCode].forEach(e => {
                        let rate = character.statData.total_ability[e.substr(0, e.length - 5) + 'rate']
                        desc += `${elements[e]} ${rate}% | `
                    })

                    resolve(
                        `
                        <meta property="og:site_name" content="BnSTree">
                        <meta property="og:title" content="${character.general.name} | ${character.general.className} | ${character.general.region.toUpperCase()}-${character.general.server}" />
                        <meta property="og:image" content="https://static.bnstree.com/images/class/${character.general.classCode}.png" />
                        <meta property="og:description" content="${desc}" />
                        `
                    )
                }
                else {
                    resolve('<meta property="og:site_name" content="BnSTree">')
                }
            })
    })

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('err', err);
            return res.status(404).end()
        }
        //const html = ReactDOMServer.renderToString(<App />)

        return res.send(
            htmlData.replace(
                '<meta property="og:site_name" content="BnSTree">',
                metadata
            )
        )
    })
}