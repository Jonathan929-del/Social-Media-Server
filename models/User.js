// Imports
import {model, Schema} from 'mongoose';



// User schema
const userSchema = new Schema({
    username:String,
    password:String,
    email:String,
    createdAt:String
});



// Export
export default model('User', userSchema);