// Imports
import {GraphQLError} from 'graphql';

import Post from '../../models/Post.js';
import checkAuth from '../../utils/checkAuth.js';



// Posts resolver
const postsResolver = {
    Query: {


        // Get posts
        getPosts:async () => {
            try {
                const posts = await Post.find().sort({createdAt:-1});
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },


        // Get post
        getPost:async (_, {postId}) => {
            try {
                const post = await Post.findById(postId);
                if(postId){
                    return post;
                }else{
                    throw new GraphQLError('Post not found.', {
                        extensions: {errors:'Post not found.'}
                    });
                }
            } catch (err) {
                throw new Error(err);
            }
        }


    },
    Mutation:{


        // Create post
        createPost:async (_, {body}, context) => {
            const user = checkAuth(context);
            if(body.trim() === ''){
                throw new GraphQLError("Post can't be empty.", {extensions:{err:"Post can't be empty."}});
            };
            const newPost = new Post({
                body,
                user:user.id,
                username:user.username,
                createdAt:new Date().toISOString()
            });
            const post = await newPost.save();
            await context.pubsub.publish('NEW_POST', {newPost:post});
            return post;
        },


        // Delete post
        deletePost:async (_, {postId}, context) => {
            const user = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted successfully.';
                }else{
                    throw new GraphQLError('Action not allowed.', {
                        extensions:{err:'Action not allowed.'}
                    });
                }
            } catch (err) {
                throw new GraphQLError('Action not allowed.', {
                    extensions:{err}
                });
            }
        }


    },
    Subscription:{
        newPost:{
            subscribe:(_, __, {pubsub}) => pubsub.asyncIterator('NEW_POST'),
        }
    }
};



// Export
export default postsResolver;