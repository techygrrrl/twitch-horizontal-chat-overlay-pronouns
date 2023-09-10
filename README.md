# Twitch Horizontal Chat Overlay with pronouns

- [Features and Roadmap](#features-and-roadmap)
- [Usage](#usage)
- [Development](#development)

## Features and Roadmap

-   [x] Show chat messages
-   [x] Configure the visibility time of each message with `time_ms=` (minimum 5000 ms / 5 seconds)
-   [x] Show badges
    -   [x] Show VIP badges
    -   [x] Show moderator badges
    -   [x] Show broadcaster badges
    -   [x] Show subscriber badges
    -   [x] Show bits badges
    -   [x] Show bit leader badges
    -   [x] Show gift leader badges
-   [x] Show pronouns

## Usage

You need to pass the following query params in the URL:

| Param            | Example                                 | Description                                                                       |
| ---------------- | --------------------------------------- | --------------------------------------------------------------------------------- |
| `token`          | _generated UUID_                        | **Required**: Get this from the `abstractrrr tokens` command                      |
| `broadcaster_id` | `123456789`                             | **Required**: Twitch user ID for the streamer user of the Abstractrrr token       |
| `time_ms`        | `5000` (default)                        | _(optional)_: Time in milliseconds that each chat message should be displayed for |
| `debug`          | `1` or `0`                              | _(optional)_: Provides extra logging                                              |
| `host`           | `localhost` (default) or `192.168.0.15` | _(optional)_: Host that abstractrrr is running on.                                |

Here is an example URL:

```
http://127.0.0.1:5173/?token=MY_ABSTRACTRRR_TOKEN&debug=1&time_ms=10000&host=192.168.0.15&broadcaster_id=123456789
```

## Development

Project built using Vue 3 + TypeScript + Vite

      npm install
      npm run dev
