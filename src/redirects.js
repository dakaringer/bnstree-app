import React from 'react'
import {Redirect} from 'react-router-dom'
import classes from './components/NavBar/linkmap_skills'

export default function getRedirects(location) {
    let redirectLinks = [<Redirect key="index" exact from="/index.html" to="/" />]

    classes.forEach(c => {
        redirectLinks.push(
            <Redirect
                key={`${c[0]}`}
                exact
                from={`/${c[0]}`}
                to={{
                    search: location.search,
                    pathname: `/skills/${c[1]}`
                }}
            />,
            <Redirect
                key={`${c[0]}-tree`}
                exact
                from={`/tree/${c[0]}`}
                to={{
                    search: location.search,
                    pathname: `/skills/${c[1]}`
                }}
            />,
            <Redirect
                key={`${c[0]}-skill`}
                exact
                from={`/skill/${c[0]}`}
                to={{
                    search: location.search,
                    pathname: `/skills/${c[1]}`
                }}
            />,
            <Redirect
                key={`${c[0]}-skill-id`}
                exact
                from={`/skill/${c[0]}/:id`}
                to={{
                    search: `?id=${location.pathname.split('/').slice(-1)[0]}`,
                    pathname: `/skills/${c[1]}`
                }}
            />,
            <Redirect
                key={`${c[0]}-classes`}
                exact
                from={`/classes/${c[1]}`}
                to={{
                    search: location.search,
                    pathname: `/skills/${c[1]}`
                }}
            />,
            <Redirect
                key={`${c[0]}-classes-my-builds`}
                exact
                from={`/classes/${c[1]}/builds`}
                to={`/skills/${c[1]}/builds`}
            />,
            <Redirect
                key={`${c[0]}-classes-my-builds`}
                exact
                from={`/classes/${c[1]}/my-builds`}
                to={`/skills/${c[1]}/my-builds`}
            />,
            <Redirect
                key={`${c[0]}-classes-badges`}
                exact
                from={`/classes/${c[1]}/badges`}
                to={`/items/badges`}
            />,
            <Redirect
                key={`${c[0]}-classes-soulshields`}
                exact
                from={`/classes/${c[1]}/soulshields`}
                to={`/items/soulshields`}
            />,
            <Redirect
                key={`${c[0]}-skills-badges`}
                exact
                from={`/skills/${c[1]}/badges`}
                to={`/items/badges`}
            />,
            <Redirect
                key={`${c[0]}-skills-soulshields`}
                exact
                from={`/skills/${c[1]}/soulshields`}
                to={`/items/soulshields`}
            />
        )
    })

    return redirectLinks
}
