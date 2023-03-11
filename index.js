// Imports
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import {createServer} from 'http';
import {WebSocketServer} from 'ws';
import bodyParser from 'body-parser';
import {ApolloServer} from '@apollo/server';
import {PubSub} from 'graphql-subscriptions';
import {useServer} from 'graphql-ws/lib/use/ws';
import {expressMiddleware} from '@apollo/server/express4';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';

import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers/index.js';



// Variables
dotenv.config();
const app = express();
const httpServer = createServer(app);
const pubsub = new PubSub();



// Database connection
const MONGO_URL = 'mongodb+srv://jonathanadel:jonathan123@graphql.ymiqzru.mongodb.net/graphql';
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL).then(() => console.log("connected to DB.")).catch(err => console.log(err));



// Schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});



// Apollo server
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});
const serverCleanup = useServer(
    {
        schema,
        context: async ({req}) => {
            return{req, pubsub}
        },
    },
    wsServer);
const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            }
        }
    ],
});
await server.start();
app.use('/', cors({origin:'*'}), bodyParser.json(),
    expressMiddleware(server, {
        context: async ({req}) => ({req, pubsub})
    })
);
const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server is now running on http://localhost:${PORT}`);
});







// import { ApolloServer, PubSub } from 'apollo-server';
// import mongoose from 'mongoose';

// import typeDefs from './graphql/typeDefs';
// import resolvers from './graphql/resolvers';
// import dotenv from 'dotenv';

// const pubsub = new PubSub();

// const PORT = process.env.port || 5000;

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => ({ req, pubsub })
// });

// const MONGODB = process.env.MONGO_URL

// mongoose
//   .connect(MONGODB, { useNewUrlParser: true })
//   .then(() => {
//     console.log('MongoDB Connected');
//     return server.listen({ port: PORT });
//   })
//   .then((res) => {
//     console.log(`Server running at ${res.url}`);
//   })
//   .catch(err => {
//     console.error(err)
//   })