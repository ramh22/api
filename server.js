const http =require( "http");
const app=require ('./app');
//const dotenv=require('dotenv');
//dotenv.config();//read environment variable before start the app
//create the server

const PORT = process.env.PORT ||10000;
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
 //— an object with a parsed key if successful or error key if an error occurred.
 // example: { parsed: { KEY: 'value' } }

 