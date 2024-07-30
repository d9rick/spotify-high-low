import React, { useState, useEffect } from 'react';
import './artists.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown} from '@fortawesome/free-solid-svg-icons';

// displays the main app
// displays the main app
function Artists() {
    const [artistQueue, setArtistQueue] = useState([]);
    const [currentArtists, setCurrentArtists] = useState({
        knownArtist: null,
        unknownArtist: null,
        knownArtistData: null,
        unknownArtistData: null,
    });
    const [knownArtistFollowers, setKnownArtistFollowers] = useState(null);
    const [guess, setGuess] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [roundReady, setRoundReady] = useState(false);

    const fetchQueue = async () => {
        setIsLoading(true);
        const queue = await fetchArtistQueue(true);

        if (!queue || queue.length < 2) {
            console.error('Error fetching artist queue');
            setIsLoading(false);
            return;
        }

        setArtistQueue(queue.slice(2));
        const [artistName1, artistName2] = queue;

        const fetchArtistData = async (artistName) => {
            const data = await getArtist(artistName);
            return data;
        };

        const knownData = await fetchArtistData(artistName1);
        const unknownData = await fetchArtistData(artistName2);

        setCurrentArtists({
            knownArtist: artistName1,
            unknownArtist: artistName2,
            knownArtistData: knownData,
            unknownArtistData: unknownData,
        });

        setKnownArtistFollowers(knownData.followers.total);
        setIsLoading(false);
        setRoundReady(true);
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const handleGuess = (guess) => {
        setGuess(guess);
    };

    const handleResult = (result) => {
        setIsCorrect(result);
        if (result !== null && result === true) {
            setTimeout(async () => {
                setScore((prevScore) => prevScore + 1);
                const newKnownArtist = currentArtists.unknownArtist;
                const newUnknownArtist = artistQueue[0];
                const newQueue = artistQueue.slice(1);

                const newKnownData = await getArtist(newKnownArtist);
                const newUnknownData = await getArtist(newUnknownArtist);

                setCurrentArtists({
                    knownArtist: newKnownArtist,
                    unknownArtist: newUnknownArtist,
                    knownArtistData: newKnownData,
                    unknownArtistData: newUnknownData,
                });

                setKnownArtistFollowers(newKnownData.followers.total);
                setArtistQueue(newQueue);
                setRoundReady(true);
            }, 1000);
        }
    };
    

    if (isLoading) {
        return <div className='loading-screen'>Loading...</div>;
    }

    return (
        <>
            <div className='comparison-screen'>
                {currentArtists.knownArtist && (
                    <ArtistPage
                        artistName={currentArtists.knownArtist}
                        known={true}
                        artistData={currentArtists.knownArtistData}
                    />
                )}
                {currentArtists.unknownArtist && roundReady && (
                    <ArtistPage
                        artistName={currentArtists.unknownArtist}
                        known={false}
                        artistData={currentArtists.unknownArtistData}
                        knownArtistFollowers={knownArtistFollowers}
                        onGuess={handleGuess}
                        onResult={handleResult}
                    />
                )}
            </div>
            <div className='score'>Score: {score}</div>

            <div className={`final-score ${isCorrect !== null && !isCorrect ? 'visible' : 'hidden'}`}>Final Score: {score}</div>
            <button className={`play-again ${isCorrect !== null && !isCorrect ? 'visible' : 'hidden'}`} onClick={() => window.location.reload()}>Play Again</button>

            <div className={`result ${isCorrect ? 'correct' : 'incorrect'} ${isCorrect !== null ? 'visible' : 'hidden'}`}>
                {isCorrect ? "Correct!" : "Incorrect!"}
            </div>
        </>
    );
}

async function fetchArtistQueue(lastfm = false) {
    if(lastfm) {
        // fetch artist queue from last.fm
        const apikey = import.meta.env.VITE_LASTFM_API_KEY;
        const username = 'mesogo';
        const period = "overall";
        const limit = 100;
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${apikey}&period=${period}&limit=${limit}&format=json`;

        const response = await fetch(url);
        const data = await response.json();
        const artists = data.topartists.artist.map((artist) => artist.name); // only get artist names

        // randomize the order of the artists
        for (let i = artists.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [artists[i], artists[j]] = [artists[j], artists[i]];
        }

        console.log(artists);

        return artists;
    }
}

function ArtistPage({ artistName, known, artistData, knownArtistFollowers, onGuess, onResult }) {
    const [guessResult, setGuessResult] = useState(null);

    useEffect(() => {
        setGuessResult(null);
    }, [artistName]);

    if (!artistData) {
        return <div>Error loading artist data</div>;
    }

    const artistImage = artistData.images[0]?.url;
    const artistFollowers = (artistData.followers.total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const handleButtonClick = (guess) => {
        onGuess(guess);
        const guessedFollowers = artistData.followers.total;
        const isCorrect = (guess === 'more' && guessedFollowers > knownArtistFollowers) || 
                          (guess === 'less' && guessedFollowers < knownArtistFollowers);
        onResult(isCorrect);
        setGuessResult(isCorrect);
    };

    if (known) {
        return (
            <div className='artist' id={`artist-${artistName}`}>
                <img className='artist-img' src={artistImage} alt={artistName} />
                <div className='artist-info'>
                    <div className='artist-name'>{artistName}</div>
                    <div className='has-separator'>has</div>
                    <div className='artist-listeners'>{artistFollowers}</div>
                    <div className='has-separator'>followers</div>
                </div>
            </div>
        );
    }

    return (
        <div className='artist' id={`artist-${artistName}`}>
            <img className='artist-img' src={artistImage} alt={artistName} />
            <div className='artist-info'>
                <div className='artist-name'>{artistName}</div>
                <div className='has-separator'>has</div>
                {guessResult === null ? (
                        <div className='button-container'>
                            <button className='button' id='up-button' onClick={() => handleButtonClick('more')}>
                                <span className='button-text'>More</span>
                                <FontAwesomeIcon icon={faCaretUp} />
                            </button>
                            <button className='button' id='down-button' onClick={() => handleButtonClick('less')}>
                                <span className='button-text'>Less</span>
                                <FontAwesomeIcon icon={faCaretDown} />
                            </button>
                        </div>
                    ) : (
                        <div className='artist-listeners'>{artistFollowers}</div>
                    )}
                <div className='has-separator'>followers</div>
            </div>
        </div>
    );
}

const getAccessToken = async () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    console.log(clientId);
    console.log(clientSecret);

    const authUrl = 'https://accounts.spotify.com/api/token';
    const authResponse = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        }),
    });

    const authData = await authResponse.json();
    return authData.access_token;
};

// returns the spotify data for an artist and returns JSON
async function getArtist(artistName) {
    const accessToken = await getAccessToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    // assume the first result is correct
    const data = await response.json();
    const artistId = data.artists.items[0].id;

    // make request to get artist data
    const artistUrl = `https://api.spotify.com/v1/artists/${artistId}`;
    const artistResponse = await fetch(artistUrl, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return await artistResponse.json();
}

export default Artists;
