const axios = require('axios').default;

const txEndpoint = '/api/slack/transactions';

exports.sendCoins = async (sender, random, coins) => {
  const request = {
    transaction: {
      sender_email: 'leprechaun.admin@klika.ba',
      receiver_email: 'emrah.dautbegovic@klika.ba',
      amount: coins,
      values: ['contribute', 'music'],
      message: 'Make it rain! | Leprechaun Jukebox'
    }
  };

  try {
    const response = await axios.post(
      process.env.LEPRECHAUN_HOST + txEndpoint,
      request
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
