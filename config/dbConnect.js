const mongoose= require('mongoose');

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    //mongodb+srv://ramh:F4b6LnDWUDk1mSkm@cluster0r.fqdymql.mongodb.net/myDatabase?retryWrites=true&w=majority
    const connected = await mongoose.connect(process.env.MONGO_URL);
    //"mongodb+srv://ramh:F4b6LnDWUDk1mSkm@cluster0r.fqdymql.mongodb.net/crafts?retryWrites=true&w=majority");
    //host = ac-qepmzr2-shard-00-02.fqdymql.mongodb.net
    console.log(`Mongodb connected ${connected.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports= dbConnect;