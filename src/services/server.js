const app =require('./app');
require('dotenv').config();

const {initDatabase}=require('../config/database')

async function startServer(){
    const PORT = process.env.PORT;
try{
  await initDatabase();
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}
catch(error){
  console.log("error starting server:",error);
}
}

startServer();