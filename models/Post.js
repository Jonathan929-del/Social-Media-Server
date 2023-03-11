// Imports
import {model, Schema} from 'mongoose';


// User schema
const postSchema = new Schema({
    body:String,
    username:String,
    createdAt:String,
    comments:[{
        body:String,
        username:String,
        createdAt:String,     
    }],
    likes:[{
        username:String,
        createdAt:String
    }],
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    }
});


// Export
export default model('Post', postSchema);