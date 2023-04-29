const http =require( "http");
const app=require ('./app');
//const dotenv=require('dotenv');
//dotenv.config();//read environment variable before start the app
//create the server

const PORT = process.env.PORT || 2030;
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
 //— an object with a parsed key if successful or error key if an error occurred.
 // example: { parsed: { KEY: 'value' } }

 /**
 * echo "# api" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M mainhttps://github.com/ramh22/MyAPI.git
git@github.com:ramh22/MyAPI.git
https://github.com/ramh22/craft2.git
C:\Users\RAZER\Downloads\New folder\craft2
git remote add origin https://github.com/ramh22/api.git
git 
 */