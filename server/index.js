const express = require('express');
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios').default;
async function startServer() {
        const app = express();
        const server = new ApolloServer({
          typeDefs: `
          type User{
            id:ID!
            firstName:String!
          }
          type Todo {   
              id:ID!            
              title:String!
              body:String!
              user: User
            
          }
          type Query{
            getTodos: [Todo]
            getUsers: [User]
            getUser(id: ID!): User            
          }
          `         
          ,
          resolvers: {
            Todo:{
              user: async (todo)=> (await axios.get(`https://dummyjson.com/users/${todo.id}`)).data 
            },

            Query:{
                getTodos: async ()=> (await axios.get('https://dummyjson.com/posts')).data.posts,
                getUsers: async ()=> (await axios.get('https://dummyjson.com/users')).data.users, 
                getUser: async (parent,{id})=> (await axios.get(`https://dummyjson.com/users/${id}`)).data  
                
            }
          }
        });
        app.use(bodyParser.json());
        app.use(cors());

        await server.start();
        app.use('/graphql', expressMiddleware(server));
        app.listen(8080,() => {console.log('listening on port 8080');});
}

startServer();