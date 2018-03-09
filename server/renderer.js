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
                    desc += `Class: ${character.general.className} | `
                    desc += `Level: ${character.general.level[0]}${character.general.level[1] ? ` • HM Level ${character.general.level[1]}` : ''} | `
                    desc += `Server: ${character.general.server}`
                    resolve(
                        `
                        <meta property="og:site_name" content="BnSTree">
                        <meta property="og:title" content="${character.general.name}" />
                        <meta property="og:image" content="${character.general.profileImg}" />
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