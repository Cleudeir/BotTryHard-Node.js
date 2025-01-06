## Summary

This project comprises a Discord bot named "dotatryhard-discord" designed to fetch and display Dota 2 player statistics.  The bot uses the `discord.js` library to interact with the Discord API and `node-fetch` to retrieve data from an external Dota 2 API.  User input (account ID or nickname) triggers the retrieval and display of player statistics, including ranking, match history, and win rate.  Error handling and a help command are implemented.  Data is cached for efficiency, updating every 7 hours.  The project is Dockerized using Docker Compose for simplified deployment and management, with environment variables managed via a `.env` file.

## Tech Stack

* Node.js
* discord.js
* node-fetch
* dotenv
* Docker
* Docker Compose
