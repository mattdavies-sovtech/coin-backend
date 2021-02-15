const { RESTDataSource } = require('apollo-datasource-rest');

class coinAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = 'https://api.coinlore.net/api/';
    }

    coinReducer(coin) {
        return{
            name: coin.name,
        };
    }

    async getCoinByName({ coinName }) {
        const res = await this.getCoinByID('tickers/', {name : coinName});
        return this.coinReducer(res.data[0]);
    }

}

module.exports = coinAPI;