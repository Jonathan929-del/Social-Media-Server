// Imports
import {GraphQLError} from 'graphql';

import Post from '../../models/Post.js';
import checkAuth from '../../utils/checkAuth.js';



// Posts resolver
const likesResolver = {
    Query: {
    
    },
    Mutation:{


        // Like post
        likePost:async (_, {postId}, context) => {
            const {username} = checkAuth(context)
            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username)){
                    post.likes = post.likes.filter(like => like.username !== username);
                }else{
                    post.likes.push({
                        username,
                        createdAt:new Date().toISOString()
                    });
                }
                await post.save();
                return post;
            } else throw new GraphQLError('Post not found.', {extensions:{err:'Post not found.'}});
        }


    }
};



// Export
export default likesResolver;