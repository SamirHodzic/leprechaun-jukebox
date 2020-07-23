#!/usr/bin/env node
require('dotenv').config();

const fs = require('fs');
const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');
const { App, ExpressReceiver } = require('@slack/bolt');
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const io = require('socket.io')(receiver.server);
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});
const bundleRenderer = createBundleRenderer(
  require('./dist/vue-ssr-bundle.json'),
  {
    template: fs.readFileSync('./index.html', 'utf-8')
  }
);
const constants = require('./server/constants');
const youtube = require('./server/yt-api');
const leprechaun = require('./server/leprechaun-api');
const helpers = require('./server/helpers');
const storage = require('./server/storage');
let forcedTimer = 0;

receiver.router.use('/dist', express.static('dist'));
receiver.router.get('*', (req, res) => {
  bundleRenderer.renderToStream({ url: req.path }).pipe(res);
});

app.event('app_home_opened', async ({ event, context }) => {
  try {
    await app.client.views.publish({
      token: context.botToken,
      user_id: event.user,
      view: constants.app_home
    });
  } catch (error) {
    console.error(error);
  }
});

app.shortcut('request_song', async ({ shortcut, ack, context, client }) => {
  try {
    await ack();
    await client.views.open({
      token: context.botToken,
      trigger_id: shortcut.trigger_id,
      view: constants.request_song
    });
  } catch (error) {
    console.error(error);
  }
});

app.view('song_chooser', async ({ ack, body, view, context }) => {
  await ack();

  const coins =
    view['state']['values']['coins']['coin_amount']['selected_option']['value'];
  const songs = await youtube.searchSongs(
    view['state']['values']['input_c']['song_name']['value']
  );
  const songsMainBlocks = JSON.parse(JSON.stringify(constants.song_chooser));
  Array.prototype.push.apply(
    songsMainBlocks.blocks,
    helpers.songSearchViewBlock(songs, coins)
  );

  try {
    await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: songsMainBlocks
    });
  } catch (error) {
    console.error(error);
  }
});

app.action('song_action', async ({ ack, body, context }) => {
  await ack();

  const songAction = body['actions'][0]['value'].split('&');
  const coins = songAction[0],
    songId = songAction[1],
    force = +coins === 5;

  if (coins > 0) {
    let senderEmail, randomEmail;

    try {
      let res = await app.client.users.info({
        token: context.botToken,
        user: body['user']['id']
      });
      senderEmail = res.user.profile.email;
    } catch (error) {
      console.error(error);
    }

    try {
      let res = await app.client.users.list({
        token: context.botToken,
        limit: 10
      });
      randomEmail = helpers.pickRandomUser(res.members, senderEmail);
    } catch (error) {
      console.error(error);
    }

    // let res = await leprechaun.sendCoins(senderEmail, randomEmail, coins);

    // if (!res) {
    //   try {
    //     await app.client.views.update({
    //       token: context.botToken,
    //       view_id: body.view.id,
    //       view: constants.leprechaun_error
    //     });
    //   } catch (error) {
    //     console.error(error);
    //   }

    //   return;
    // }
  }

  try {
    await app.client.views.update({
      token: context.botToken,
      view_id: body.view.id,
      view: constants.song_action
    });
  } catch (error) {
    console.error(error);
  }

  let songDetails = await youtube.songDetails(songId);
  let song = {
    videoId: songId,
    title: songDetails[0].snippet.title,
    thumbnail: songDetails[0].snippet.thumbnails.high.url,
    duration: helpers.convertYoutubeDuration(
      songDetails[0].contentDetails.duration
    ),
    duration_seconds: helpers.convertYoutubeDurationToSeconds(
      songDetails[0].contentDetails.duration
    ),
    requestedBy: body['user']['name'],
    force: force,
    votes: [],
    ts: null
  };

  if (+coins === 0) {
    try {
      let response = await app.client.chat.postMessage({
        token: context.botToken,
        channel: process.env.JUKEBOX_CHANNEL,
        text: 'New song requested:',
        blocks: helpers.createSongVotingMessage(song, body['user']['id'])
      });
      song.ts = response.ts;
      storage.setVotingSong(song);
    } catch (error) {
      console.error(error);
    }
  } else {
    storage.setSong(song);
    io.emit('new_song', song);

    if (force) {
      forcedTimer += song.duration_seconds - 8;
      if (song.duration_seconds - 8 == forcedTimer) trackForced();
    }

    try {
      await app.client.chat.postMessage({
        token: context.botToken,
        channel: process.env.JUKEBOX_CHANNEL,
        text: 'New song requested:',
        blocks: helpers.createSongMessage(song, body['user']['id'])
      });
    } catch (error) {
      console.error(error);
    }
  }
});

app.action('vote_action_0', async ({ ack, body, context }) => {
  await ack();
  handleVote(body, context, 0);
});

app.action('vote_action_1', async ({ ack, body, context }) => {
  await ack();
  handleVote(body, context, 1);
});

function handleVote(body, context, val) {
  const voteAction = body['actions'][0]['value'];
  let vote = {
    vote: val,
    user: body['user']['name']
  };

  storage.findVotingSong(voteAction, songVoting => {
    if (songVoting.votes.length < 5) {
      if (songVoting.votes.find(o => o.user === vote.user)) return;

      storage.updateVotingSong(voteAction, vote, song => {
        voteToNewSong(song, context, body);

        if (song.votes.length === 5) {
          let success = song.votes.filter(vote => vote.vote == 1).length > 2;

          if (success) {
            storage.setSong(song);
            io.emit('new_song', song);
          }
        }
      });
    }
  });
}

async function voteToNewSong(song, context, body) {
  try {
    await app.client.chat.update({
      token: context.botToken,
      channel: process.env.JUKEBOX_CHANNEL,
      text: 'New song requested:',
      ts: song.ts,
      blocks: helpers.createSongVotingMessage(song, body['user']['id'])
    });
  } catch (error) {
    console.error(error);
  }
}

function trackForced() {
  let forceInterval = setInterval(() => {
    if (forcedTimer > 0) {
      forcedTimer--;
    } else {
      storage.updateSongs();
      clearInterval(forceInterval);
      forcedTimer = 0;
      io.emit('force_done', true);
    }
  }, 1000);
}

io.on('connection', socket => {
  storage.getSongs(songs => {
    socket.emit('first_playlist', { songs: songs, force: forcedTimer > 0 });
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ leprechaun-jukebox is running! ⚡️');
})();
