module.exports = {
  request_song: {
    type: 'modal',
    callback_id: 'song_chooser',
    title: {
      type: 'plain_text',
      text: 'Leprechaun Jukebox'
    },
    submit: {
      type: 'plain_text',
      text: 'Submit'
    },
    close: {
      type: 'plain_text',
      text: 'Cancel'
    },
    blocks: [
      {
        type: 'input',
        block_id: 'input_c',
        label: {
          type: 'plain_text',
          text: 'Artist / Song name'
        },
        element: {
          type: 'plain_text_input',
          action_id: 'song_name',
          min_length: 3,
          max_length: 40,
          placeholder: {
            type: 'plain_text',
            text: 'What do you want to to be played next?'
          }
        }
      },
      {
        type: 'input',
        block_id: 'coins',
        element: {
          type: 'static_select',
          action_id: 'coin_amount',
          placeholder: {
            type: 'plain_text',
            text: 'Select amount of coins you want to randomly throw for song'
          },
          options: [
            {
              text: {
                type: 'plain_text',
                text: '0 coins (Song needs to be approved by channel members)'
              },
              value: '0'
            },
            {
              text: {
                type: 'plain_text',
                text: '1 coin (Song is added to playlist without approval)'
              },
              value: '1'
            },
            {
              text: {
                type: 'plain_text',
                text:
                  '5 coins (Force this song to play to all current Jukebox listeners)'
              },
              value: '5'
            }
          ]
        },
        label: {
          type: 'plain_text',
          text: 'Coin donation'
        }
      }
    ]
  },
  song_chooser: {
    type: 'modal',
    callback_id: 'song_list',
    title: {
      type: 'plain_text',
      text: 'Leprechaun Jukebox'
    },
    close: {
      type: 'plain_text',
      text: 'Cancel'
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            'If song from search result is one you are looking for, click "Add to jukebox"'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Search results*'
        }
      }
    ]
  },
  song_action: {
    type: 'modal',
    callback_id: 'success',
    title: {
      type: 'plain_text',
      text: 'Leprechaun Jukebox'
    },
    close: {
      type: 'plain_text',
      text: 'Close'
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            'Congratulations, your song is being approved and will be soon part of our playlist.  :notes::notes:'
        }
      }
    ]
  },
  leprechaun_error: {
    type: 'modal',
    callback_id: 'success',
    title: {
      type: 'plain_text',
      text: 'Leprechaun Jukebox'
    },
    close: {
      type: 'plain_text',
      text: 'Close'
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            'Something went wrong while transfering your coins below rainbow :cry:\nPlease try again or contact support.'
        }
      }
    ]
  },
  app_home: {
    type: 'home',
    blocks: [
      {
        type: 'image',
        image_url: 'https://i.ibb.co/7JM1x6M/logo.png',
        alt_text: 'logo'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            '*What is Leprechaun Jukebox?*\n\nLeprechaun Jukebox is a Slack app that allows you to contribute making playlist together with other Slack users.\nLeprechaun Jukebox is a modern day jukebox. Create your office playlist collaboratively via Slack.\nSearch for tracks, artists and albums using the commands you are already familiar with; and add the tracks you love to your playlist.\nLeprechaun Jukebox also allows you and your team to control playlist by voting for next songs, donating for instant addition or donating to force everyone to listen your song next.'
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*How it works?*\n\nWant to know all the cool stuff you can do with Leprechaun Jukebox? Check out the how it works by launching it through global shortcut. Check playlist and listen it here <${process.env.HOSTNAME}|Leprechaun Jukebox>.`
        }
      },
      {
        type: 'image',
        image_url: 'https://i.ibb.co/GkQVpHb/global-shortcut.png',
        alt_text: 'shortcut'
      }
    ]
  }
};
