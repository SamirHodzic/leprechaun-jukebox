exports.convertYoutubeDuration = duration => {
  let humanDuration = this.convertYoutubeDurationToSeconds(duration);
  let hrs = ~~(humanDuration / 3600);
  let mins = ~~((humanDuration % 3600) / 60);
  let secs = ~~humanDuration % 60;
  let ret = '';

  if (hrs > 0) ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
};

exports.convertYoutubeDurationToSeconds = duration => {
  let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  match = match.slice(1).map(function(x) {
    if (x != null) return x.replace(/\D/, '');
  });

  let hours = parseInt(match[0]) || 0;
  let minutes = parseInt(match[1]) || 0;
  let seconds = parseInt(match[2]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
};

exports.songSearchViewBlock = (songs, coins) => {
  let blocks = [];

  for (let i = 0; i < songs.length; i++) {
    let song = songs[i];
    blocks.push({
      type: 'divider'
    });

    let section = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${song.snippet.title}*\n${song.snippet.description}`
      },
      accessory: {
        type: 'image',
        image_url: song.snippet.thumbnails.high.url,
        alt_text: 'thumbnail image'
      }
    };

    blocks.push(section);

    let action = {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Add to jukebox'
          },
          value: `${coins}&videoId=${song.id.videoId}`,
          action_id: 'song_action'
        }
      ]
    };

    blocks.push(action);
  }

  return blocks;
};

exports.createSongMessage = (song, user) => {
  return [
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:notes:  *${song.title}*  :notes: \nDuration: ${
          song.duration
        } \n\n\n${
          song.force ? 'Forced' : 'Added'
        } by <@${user}>   :sunglasses: :star:   Listen here: <${process.env.HOSTNAME}|Leprechaun Jukebox>`
      },
      accessory: {
        type: 'image',
        image_url: song.thumbnail,
        alt_text: 'thumbnail'
      }
    },
    {
      type: 'divider'
    }
  ];
};

exports.createSongVotingMessage = (song, user) => {
  const votes = song.votes.length;
  let base = [
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:notes:  *${song.title}*  :notes: \nDuration: ${song.duration} \n\n\nRequested by <@${user}>   :sunglasses: :star:   Listen here: <${process.env.HOSTNAME}|Leprechaun Jukebox>`
      },
      accessory: {
        type: 'image',
        image_url: song.thumbnail,
        alt_text: 'thumbnail'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `_*Do you want this song to be added to playlist?* (${votes}/5 votes)_`
      }
    }
  ];

  if (votes !== 5) {
    base.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Yes'
          },
          value: song.videoId,
          action_id: 'vote_action_1'
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'No'
          },
          value: song.videoId,
          action_id: 'vote_action_0'
        }
      ]
    });
  } else {
    let success = song.votes.filter(vote => vote.vote == 1).length > 2;

    base.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${
          success ? '*Approved*   :heavy_check_mark:' : '*Declined*   :x:'
        }`
      }
    });
  }

  return base;
};
