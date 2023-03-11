// Type definitions
const typeDefs = `

  type Query {
    getPosts:[Post]
    getPost(postId:ID!):Post
  }

  type Mutation {
    register(registerInput:RegisterInput):User!
    login(loginInput:LoginInput):User!
    createPost(body: String!): Post!
    deletePost(postId:ID!):String!
    createComment(postId:ID!, body:String!):Post!
    deleteComment(postId:ID!, commentId:ID!):Post!
    likePost(postId:ID!):Post!
  }




  input RegisterInput {
    username:String!
    password:String!
    confirmPassword:String!
    email:String!
  }

  input LoginInput {
    username:String!
    password:String!
  }




  type User {
    id:ID!
    username:String!
    email:String!
    token:String!
    createdAt:String!
  }

  type Post {
    id:ID!
    body:String!
    createdAt:String!
    username:String!
    likes:[Like]!
    comments:[Comment]!
    likeCount:Int!
    commentCount:Int!
  }

  type Comment {
    id:ID!
    body:String!
    username:String!
    createdAt:String!
  }

  type Like {
    id:ID!
    username:String!
    createdAt:String!
  }




  type Subscription {
    newPost:Post!
  }

`;

export default typeDefs;