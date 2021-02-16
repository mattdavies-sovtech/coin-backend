const {ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch');

var coins;
var markets;

const typeDefs = gql`
    type Coin {
        id: String
        symbol: String
        name: String
        nameid: String
        price_usd: String
        percent_change_1h: String
        percent_change_24h: String
        rank: String
    }

    type CoinMarket {
        name: String
        base: String
        qoute: String
        price: String
        volume: String
        time: String
    }

    type Query {
        coins: [Coin]!
        coin(nameid: String!): Coin
        coinMarket(cid: String): [CoinMarket]!
    }
`;

const resolvers = {
    Query: {
        coins: () => getCoins(),
        coin: (_, {nameid}, __) =>  getCoinByName(nameid, coins),
        coinMarket: (_,{cid},__) => getCoinMarkets(cid),
    },
};

async function getCoins() {
    await fetch('https://api.coinlore.net/api/tickers/')
    .then(res => res.json())
    .then(data => {
        console.log("First coin in the array:");
        console.log(data.data[0]);
        console.log("symbol of the first coin in the array:");
        console.log(data.data[0].id);
        coins = data.data;
        console.log(coins[1]);
})
    return coins;
}

async function getCoinMarkets(id) {
    await fetch(`https://api.coinlore.net/api/coin/markets/?id=${id}`)
    .then(res => res.json())
    .then(data => {
        console.log("First Market in array:");
        console.log(data[0].name)
        markets = data;
    })

    return markets;
}

function getCoinByName(nameid, coins) {
    for (var i=0; i<coins.length;i++) {
        if(coins[i].nameid == nameid) {
            return coins[i]
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`);
});