// Imports
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {GraphQLError} from 'graphql';

import User from '../../models/User.js';
import {validatRegisterInput, validateLoginInput} from '../../utils/validators.js';



// Generate token
const generateToken = user => {
    return jwt.sign({
        id:user.id,
        email:user.email,
        username:user.username,
    }, 'secretjwtkey', {expiresIn:'1h'});
};



// User resolver
const userResolver = {
    Query:{

    },
    Mutation:{


        // Register user
        async register (
            _,
            {
                registerInput:{
                    username, email, password, confirmPassword
                }
            }
        ){
            const {errors, valid} = validatRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new GraphQLError('Error.', {
                    extensions: {errors}
                });
            };
            const user = await User.findOne({username});
            if(user){
                throw new GraphQLError('Username is taken.', {
                    extensions: {errors:{username:'Username is taken.'}}
                });
            };
            password = await bcrypt.hashSync(password);
            const newUser = new User({
                email,
                username,
                password,
                createdAt:new Date().toISOString()
            });
            const res = await newUser.save();
            const token = generateToken(res);

            return{
                ...res._doc,
                id:res._id,
                token
            }
        },


        // Login user
        login:async (
            _,
            {
                loginInput:{
                    username, password
                }
            }
        ) => {
            const {errors, valid} = validateLoginInput(username, password);
            if(!valid){
                throw new GraphQLError('Error.', {
                    extensions: {errors}
                });
            };
            const user = await User.findOne({username});
            if(!user){
                errors.general = 'User does not excists.';
                throw new GraphQLError('User does not excists.', {extensions:{errors}});
            };
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = 'Wrong credentials.';
                throw new GraphQLError('Wrong credentials.', {extensions:{errors}});
            }
            const token = generateToken(user);

            return {
                ...user._doc,
                id:user._id,
                token
            };
        },


    }
}



// Export
export default userResolver;