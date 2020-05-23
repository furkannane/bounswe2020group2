import { useState } from 'react'
import Head from 'next/head'

import axios from 'axios'

import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('../components/MapView'), { ssr: false })
// axios is a library used to make requests

// THIS CODE IS EXECUTED ON THE ********SERVER******** SIDE
// You can use this function to receive the request params
// and render something on the server
// the return of this function is fed into Home component

// REMEMBER: You can always console.log (either in the server or in the browser, depending on where the code is
// executed) to see what each object looks like!
export async function getServerSideProps(ctx) {
    const { req, query } = ctx
    const { url, method, headers } = req
    const context = { query, url, method }
    return { props: { context } } // This object called "context" is the same context object in Home
}

// THIS CODE IS EXECUTED ON THE ********CLIENT******** SIDE
export default function Home({ context }) {
    // <-- This "context" object is the same object return in getServerSideProps
    // REMEMBER: You can always console.log (either in the server or in the browser, depending on where the code is
    // executed) to see what each object looks like!

    const [coordinates, setCoordinates] = useState({
        longitude: 29.046874,
        latitude: 41.085212,
    })

    const [covidStatsString, setCovidStatsString] = useState()
	
	const [postsJSON, setPostsJSON] = useState()

    const [currency, setCurrency] = useState({
        code: 'TRY',
        symbol: 'TL',
        name: 'Turkish Lira',
    })

    const [language, setLanguage] = useState({
        code: 'TUR',
        name: 'Turkish',
    })

    const [country, setCountry] = useState({
        code: 'TR',
        name: 'Turkey',
    })

    const onMapClick = async ({ longitude, latitude }) => {
        try {
            console.log({ longitude, latitude })
            const { data } = await axios.get(`api/getLocationInfo?lat=${latitude}&lng=${longitude}`)
            const { valid, currency, country, language } = data
            console.log(data)

            if (!valid) {
                setCurrency(undefined)
                setCountry(undefined)
                setLanguage(undefined)
                return
            }

            setCountry({ name: country })
            setLanguage({ name: language })
            setCurrency(currency)
        } catch (error) {
            console.error(error)
            setCurrency(undefined)
            setCountry(undefined)
        } finally {
            setCoordinates({ longitude, latitude })
        }
    }

    const getCovidStats = async () => {
        if (country.name == null) {
            setCovidStatsString('Please select a location by clicking on the map')
            return
        }
        const { data } = await axios.get(`api/getStatistics?country=${country.name}`)

        if (data.answered == 'yes') {
            setCovidStatsString(
                `Country: ${country.name} Death Toll:  ${data.deathToll} Recovered People:  ${data.recovery} Infected People: ${data.infection}`,
            )
        } else {
            setCovidStatsString('No information available about your country')
        }
    }
	
	const getPosts = async () => {
        const { data } = await axios.get(`api/getRedditData?country=${country.name}`)
		
        if (data.answered == 'yes') {
			//console.log(data.posts)
            setPostsJSON(
                data.posts
            )
        } else {
            setPostsJSON(undefined)
        }
    }
	
    const locationGreeting = () =>
        `You are a user from ${country.name}, you speak ${language.name} and you buy in ${currency.name}`
	
    return (
        <div className="container">
            <Head>
                <title>Our example API</title>
                <link rel="icon" href="/favicon.ico" />
                <link href="https://api.mapbox.com/mapbox-gl-js/v1.10.0/mapbox-gl.css" rel="stylesheet" />
                <link
                    rel="stylesheet"
                    href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.css"
                    type="text/css"
                />
            </Head>
            <main>
                <h1>Welcome to our demo website!</h1>
                {country && language && currency && <p>{locationGreeting()} </p>}
                <MapView onMapClick={onMapClick} coordinates={coordinates} />

                <button onClick={getCovidStats}>
                    Click me to get Covid death statistics for the country you have chosen on the map
                </button>
                {covidStatsString !== undefined && <p>{covidStatsString}</p>}
				
				<button onClick={getPosts}>
                    Click me to get top posts from the subreddit for the country you have chosen on the map
                </button>
				{postsJSON !== undefined &&
				<div>
				<p><a href={'https://www.reddit.com'+ postsJSON[0].permalink}>{postsJSON[0].title} </a></p>
				<p><a href={'https://www.reddit.com'+ postsJSON[1].permalink}>{postsJSON[1].title} </a></p>
				<p><a href={'https://www.reddit.com'+ postsJSON[2].permalink}>{postsJSON[2].title} </a></p>
				<p><a href={'https://www.reddit.com'+ postsJSON[3].permalink}>{postsJSON[3].title} </a></p>
				<p><a href={'https://www.reddit.com'+ postsJSON[4].permalink}>{postsJSON[4].title} </a></p>
				<p><a href={'https://www.reddit.com'+ postsJSON[5].permalink}>{postsJSON[5].title} </a></p>
				<p><a href={'https://www.reddit.com'+ postsJSON[6].permalink}>{postsJSON[6].title} </a></p>
				<p><a href={'https://www.reddit.com'+ postsJSON[7].permalink}>{postsJSON[7].title} </a></p>
				<p><a href={'https://www.reddit.com'+ postsJSON[8].permalink}>{postsJSON[8].title} </a></p>
				<p><a href={'https://www.reddit.com'+ postsJSON[9].permalink}>{postsJSON[9].title} </a></p>
				</div>
				}
            </main>
            <style jsx global>
                {`
                    html,
                    body {
                        padding: 0;
                        margin: 1%;
                        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
                            Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                    }

                    * {
                        box-sizing: border-box;
                    }
                `}
            </style>
        </div>
    )
}
