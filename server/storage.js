const MongoClient = require('mongodb').MongoClient;
const dbName = 'leprechaun_jukebox';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

exports.setSong = song => {
  MongoClient.connect(process.env.MONGO_ATLAS_URL, options, (_, client) => {
    client
      .db(dbName)
      .collection('songs')
      .insertOne(song, () => {
        client.close();
      });
  });
};

exports.setVotingSong = song => {
  MongoClient.connect(process.env.MONGO_ATLAS_URL, options, (_, client) => {
    client
      .db(dbName)
      .collection('songs_voting')
      .insertOne(song, () => {
        client.close();
      });
  });
};

exports.findVotingSong = (voteAction, callback) => {
  MongoClient.connect(process.env.MONGO_ATLAS_URL, options, (_, client) => {
    client
      .db(dbName)
      .collection('songs_voting')
      .findOne({ videoId: voteAction[0], hash: voteAction[1] }, (_, doc) => {
        callback(doc);
        client.close();
      });
  });
};

exports.updateVotingSong = (voteAction, vote, callback) => {
  MongoClient.connect(process.env.MONGO_ATLAS_URL, options, (_, client) => {
    client
      .db(dbName)
      .collection('songs_voting')
      .findOneAndUpdate(
        {
          videoId: voteAction[0],
          hash: voteAction[1]
        },
        { $push: { votes: vote } },
        { returnOriginal: false },
        (_, doc) => {
          callback(doc.value);
          client.close();
        }
      );
  });
};

exports.updateSongs = () => {
  MongoClient.connect(process.env.MONGO_ATLAS_URL, options, (_, client) => {
    client
      .db(dbName)
      .collection('songs')
      .updateMany(
        {
          force: true
        },
        { $set: { force: false } },
        () => {
          client.close();
        }
      );
  });
};

exports.getSongs = callback => {
  MongoClient.connect(process.env.MONGO_ATLAS_URL, options, (_, client) => {
    client
      .db(dbName)
      .collection('songs')
      .aggregate([
        {
          $group: {
            _id: null,
            coins: { $sum: '$coins' },
            songs: { $push: '$$ROOT' }
          }
        }
      ])
      .toArray((_, data) => {
        callback(data.length > 0 ? data[0] : { songs: [], coins: 0 });
        client.close();
      });
  });
};
