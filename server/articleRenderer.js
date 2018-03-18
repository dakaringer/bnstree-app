const path = require("path")
const fs = require("fs")

const gql = require('graphql-tag')
const gqlClient = require('./apollo')

const articleQuery = gql`query ($id: ID!) {
    Articles {
        article(id: $id) {
            _id
            title
            content
            thumb
        }
    }
}`

export default async (req, res, next) => {
    let id = req.params.id

    let buildPath = process.env.NODE_ENV === 'production' ? 'build_final' : 'build'
    const filePath = path.resolve(__dirname, '..', buildPath, 'index.html')

    let metadata = await new Promise((resolve, reject) => {
        gqlClient
            .query({
                query: articleQuery,
                variables: {
                    id: id
                }
            }).then(json => {
                let article = json.data.Articles.article
                if (article) {
                    resolve(
                        `
                        <meta property="og:site_name" content="BnSTree">
                        <meta property="og:title" content="${article.title}" />
                        <meta property="og:description" content="${article.content.split('\n\n')[0]}" />
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