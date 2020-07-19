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

exports.findVotingSong = (videoId, callback) => {
  MongoClient.connect(process.env.MONGO_ATLAS_URL, options, (_, client) => {
    client
      .db(dbName)
      .collection('songs_voting')
      .findOne({ videoId: videoId }, (_, doc) => {
        callback(doc);
        client.close();
      });
  });
};

exports.updateVotingSong = (videoId, vote, callback) => {
  MongoClient.connect(process.env.MONGO_ATLAS_URL, options, (_, client) => {
    client
      .db(dbName)
      .collection('songs_voting')
      .findOneAndUpdate(
        {
          videoId: videoId
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
      .find({}, {})
      .sort({ createdAt: 1 })
      .toArray()
      .then(songs => {
        callback(songs);
        client.close();
      });
  });
};
