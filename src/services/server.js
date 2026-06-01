const app =require('./app');
require('dotenv').config();

const {initDatabase}=require('./config/database')

async function startServer(){
    
try{
  await initDatabase();
  app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
}
catch(error){
  console.log("error starting server:",error);
}
}

startServer();