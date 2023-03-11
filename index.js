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
const MONGO_URL = process.env.MONGO_URL;
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
app.use('/graphql', cors({origin:'*'}), bodyParser.json(),
    expressMiddleware(server, {
        context: async ({req}) => ({req, pubsub})
    })
);
httpServer.listen(4000, () => {
    console.log('🚀 Server is now running on http://localhost:4000/graphql');
});