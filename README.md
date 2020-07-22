<img src="https://github.com/SamirHodzic/leprechaun-jukebox/blob/master/src/assets/logo.png" alt="logo" width="400"/>

# Leprechaun Jukebox
> Leprechaun Jukebox is a modern day jukebox. 

## What is Leprechaun Jukebox?

Leprechaun Jukebox is a Slack app that allows you to contribute making playlist together with other Slack users. 

Create your office playlist collaboratively via Slack.
Search for tracks, artists and albums using the commands you are already familiar with; and add the tracks you love to your playlist.

Leprechaun Jukebox also allows you and your team to control playlist by voting for next songs, donating for instant addition or donating to force everyone to listen your song next.

## How it works?
Want to know all the cool stuff you can do with Leprechaun Jukebox? 
Check out the how it works by launching it through global shortcut.

**DEMO**: Check playlist and listen it here **[Leprechaun Jukebox](https://leprechaun-jukebox.herokuapp.com)**!

## Setup

### Slack

1. Create a new Slack app https://api.slack.com/apps?new_app=1

2. Enable and add **Shortcut** with `request_song` Callback ID for global shortcut interactivity

3. Enable **Event Subscriptions** and **Home Tab**, create bot event `app_home_opened` for bot pages profile

4. Install the app to your workspace

5. Invite bot user to a channel where it will show added songs or votings

6. Rename `.env.example` to `.env` and update the variables with your tokens / client / specific channel / mongodb host

### Application

1. Clone the project:
```shell
$ git clone https://github.com/SamirHodzic/leprechaun-jukebox
$ cd leprechaun-jukebox
```

2. Install dependencies described in the `package.json`:
``` shell
$ npm install
```

3. Build client/server parts of application:
```shell
$ npm run build
```

4. Start application:
```shell
$ npm start
```

Visit http://localhost:3000 and play around!

### Technology stack used

- Javascript
- Express
- Slack Bolt
- MongoDB
- Socket.io
- Vue.js

## License
[MIT](https://github.com/SamirHodzic/leprechaun-jukebox/blob/master/LICENSE)
