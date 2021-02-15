const http = require('http');
const {ApolloServer, gql } = require('apollo-server');

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

    type Query {
        coins: [Coin]!
        coin(nameid: String!): Coin
    }
`;

const resolvers = {
    Query: {
        coins: () => coins,
        coin: (_, {nameid}, __) =>  getCoinByName(nameid, coins),
    },
};

function getCoinByName(nameid, coins) {
    for (var i=0; i<coins.length;i++) {
        if(coins[i].nameid == nameid) {
            return coins[i]
        }
    }
}

const fetch = require('node-fetch');
var coins;

fetch('https://api.coinlore.net/api/tickers/')
    .then(res => res.json())
    .then(data => {
        console.log("First coin in the array:");
        console.log(data.data[0]);
        console.log("symbol of the first coin in the array:");
        console.log(data.data[0].id);
        coins = data.data;
        console.log(coins[1]);
})

const server = new ApolloServer({ typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`);
});