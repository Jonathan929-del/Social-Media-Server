// Imports
import postsResolver from './posts.js';
import usersResolver from './users.js';
import commentsResolver from './comments.js';
import likesResolver from './likes.js';



// Main resolver
const resolvers = {
    Query:{
        ...usersResolver.Query,
        ...postsResolver.Query,
        ...commentsResolver.Query,
        ...likesResolver.Query
        
    },
    Mutation:{
        ...usersResolver.Mutation,
        ...postsResolver.Mutation,
        ...commentsResolver.Mutation,
        ...likesResolver.Mutation
    },
    Subscription:{
        ...postsResolver.Subscription,
    },
    Post:{
        likeCount: parent => parent.likes.length,
        commentCount: parent => parent.comments.length,
    }
}



// Export
export default resolvers;