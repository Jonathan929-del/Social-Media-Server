// Imports
import jwt from 'jsonwebtoken';



// Check token functions
const check = context => {
    const authHeader = context.req.headers.authorization;
    if(authHeader){
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const user = jwt.verify(token, secretjwtkey);
          return user;
        } catch (err) {
          throw new Error('Invalid/Expired token.');
        }
      }
      throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided.');
};



// Export
export default check;