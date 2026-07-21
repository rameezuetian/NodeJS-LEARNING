const express = require("express");
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require("@apollo/server/express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios  = require("axios")


async function startServer(){
    const app = express();
    const server = new ApolloServer({
        typeDefs : `
        type User{
        id :ID!
        name : String!
        username : String!
        email : String!
        phone : String!
        website :String!


        
        }
        type Todo {
            id:ID!
            title : String!
            completed : Boolean!
            user : User
        
        }
            type Query {
                getTodos : [Todo]
                getAllUsers : [User]
                getUser(id :ID!) : User
            }
        `,
        resolvers : {
            Todo:{
                user: async (todo) =>(
                    await axios.get("urls")
                ).data,
            },
            Query : {
                // getTodos : ()=> [{
                //     id : 1 , title : "Something Something" , completed :false
                // },]
                getTodos : async () => (await axios.get("url for get ")).data,
                getAllUsers : async ()=> (await axios.get("urls")).data,
                getUser : async.get(`urls${id}`).data,
            }
        }
    });


    app.use(bodyParser.json());
    app.use(cors());

    await server.start()

    app.use("/graphql" , expressMiddleware(server));
    app.listen(8000, ()=> console.log("Server Started at PORT 8000"));
}

startServer
