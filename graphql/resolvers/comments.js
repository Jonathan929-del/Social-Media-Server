// Imports
import {GraphQLError} from 'graphql';

import Post from '../../models/Post.js';
import checkAuth from '../../utils/checkAuth.js';



// Posts resolver
const commentsResolver = {
    Query: {
    
    },
    Mutation:{


        // Create comment
        createComment:async (_, {postId, body}, context) => {
            const {username} = checkAuth(context);
            if(body.trim() === ''){
                throw new GraphQLError('Cannot post empty comment.', {extentions:{
                    err:'Cannot post empty comment.'
                }});
            }
            const post = await Post.findById(postId);
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt:new Date().toISOString()
                });
                await post.save();
                return post;
            } else throw new GraphQLError('Post not found.', {extentions:{err:'Post not found.'}});
        },


        // Delete comment
        deleteComment:async (_, {postId, commentId}, context) => {
            const {username} = checkAuth(context);
            const post = await Post.findById(postId);
            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);
                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                }else throw new GraphQLError('Action not allowed.', {extentions:{err:'Action not allowed.'}});
            } else throw new GraphQLError('Post not found.', {extentions:{err:'Post not found.'}});
        }
    }
};



// Export
export default commentsResolver;