# Artist Guessing Game

A web-based game where players guess which artist has more followers. Built with React, the game fetches artist data from Spotify and displays two artists at a time. Players guess which artist has more followers and the game keeps track of the score.

## Features

- Fetches top artists from Last.fm.
- Retrieves artist data from Spotify.
- Displays two artists for comparison.
- Keeps track of the player's score.
- Displays "Correct!" for correct guesses and "Incorrect!" for wrong guesses.
- Shows final score and provides an option to play again.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/artist-guessing-game.git
    cd artist-guessing-game
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your Last.fm and Spotify API keys:
    ```env
    VITE_LASTFM_API_KEY=your_lastfm_api_key
    VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
    VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

## Usage

1. Open your browser and go to `http://localhost:3000`.
2. The game will display two artists.
3. Click on "More" or "Less" to guess which artist has more followers.
4. The game will indicate if your guess was correct or incorrect.
5. Your score will be updated accordingly.
6. When the game ends, you can see your final score and play again.

## Components

### `Artists`

The main component that manages the game state, fetches artist data, and handles user interactions.

### `ArtistPage`

A component that displays an individual artist's data and handles user guesses.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Last.fm API](https://www.last.fm/api)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
