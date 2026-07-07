import mongoose from "mongoose";

const connect = () => {
    mongoose.connect(
        'mongodb+srv://jini031104:hani100900@express-mongo.s1oq6.mongodb.net/?appName=express-mongo',
        {
            dbName: 'memo_list',
        }
    ).then(() => console.log('MongoDB 연결에 성공'))
    .catch((err) => console.log(`MongoDB 연결에 실패: ${err}`))
};

export default connect;