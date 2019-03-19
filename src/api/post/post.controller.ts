import {Request, Response, NextFunction} from 'express';
import PostModel from './post.model';
import * as httpStatus from 'http-status';


export default class UserController {

  /**
 * Get all the Posts from the database
 * @param {Object} req: url params
 * @param {Function} res: Express.js response callback
 * @param {Function} next: Express.js middleware callback
 * @author Freeman Ogbiyoyo
 * @public
 */
  public static async getAllPost(req : Request, res : Response, next : NextFunction) {

    try {

      // Get data from the db
      let result = await PostModel
        .find()
        .exec();
      const status = res.statusCode;

      // Response
      res.send({message: 'it works! We got all posts', result: result, status: status});
    } catch (err) {

      // Error response
      res.send({message: 'Could not get Post', err: err});
    }
  }

  

  /**
 * Create a post in the database
 * @param {Object} req: url params
 * @param {Function} res: Express.js response callback
 * @param {Function} next: Express.js middleware callback
 * @author Freeman Ogbiyoyo
 * @public
 */

  public static createPost(req : Request, res : Response, next : NextFunction) : void {

    // The attributes.
    const {
        author,
        permlink,
        postImage,
        postDescription,
        postTitle,
        likes,
        views,
        comments,
        Tags,
        postedTo
    } = req.body;

  
      PostModel
        .create({
            author,
            permlink,
            postImage,
            postDescription,
            postTitle,
            likes,
            views,
            comments,
            Tags,
            postedTo  
        })
        .then(post => {
          res
            .status(201)
            .send({
              data: {
                message: "Successfully Created",
                post,
                status: httpStatus.CREATED
              }
            });
        })
        .catch(err => {
          res
            .status(400)
            .send({
              errors: [
                {
                  title: "Can't create the post",
                  detail: err.message
                }
              ]
            });
        });
    }


  /**
 * Delete a user in the database
 * @param {Object} req: url params
 * @param {Function} res: Express.js response callback
 * @param {Function} next: Express.js middleware callback
 * @author Freeman Ogbiyoyo
 * @public
 */
  public static async deletePost(req : Request, res : Response, next : NextFunction) {

    try {

      //
      // Get data

      const id : String = req.params._id;
      let result = await PostModel.findOneAndDelete({
        id
      }, {
        ...req.body,
        deletedAt: new Date()
      }).exec()

      const status = res.statusCode;
      //
      // Response
      return res.send({message: 'Sucessfully deleted a user', result: result, status: status});
    } catch (err) {

      //
      // Error response
      res.send({message: 'Could not delete post', err: err});
    }
  }

   /**
 * Return a user in the database
 * @param {Object} req: url params
 * @param {Function} res: Express.js response callback
 * @param {Function} next: Express.js middleware callback
 * @author Freeman Ogbiyoyo
 * @public
 */
public static async getPost(req : Request, res : Response, next : NextFunction) {

  try {

    //
    // Get data

    const _id : String = req.params._id;
    let result = await PostModel.findById({_id})

    const status = res.statusCode;
    
    // Response
    return res.send({message: 'Sucessfully fetched the post', result: result, status: status});
  } catch (err) {

    //
    // Error response
    res.send({message: 'Could not fetch post', err: err});
  }
}

  public static async updatePost(req : Request, res : Response, next : NextFunction) {
    
    try {
      //
      // Get data
      var options = {
        // Return the document after updates are applied
        new: true,
        // Create a document if one isn't found. Required for `setDefaultsOnInsert`
        upsert: true,
        setDefaultsOnInsert: true
      };

      const _id : String = req.params._id;
      
      let result = await PostModel.findOneAndUpdate({
        _id
      }, {
        ...req.body,
        modifiedAt: new Date()
      }, options).exec()

      const status = res.statusCode;

      
      // Response
      return res.send({message: 'Sucessfully updated a post', result: result, status: status});
    } catch (err) {

      //
      // Error response
      res.send({message: 'Could not update the post', err: err});
    }
  }

  /**
   * @ method updateLike - Method to update likes on a post. 
   * @param req 
   * @param res 
   * @param next 
   * @return Object result - responses from the server. 
   */
  public static async updateLikes(req : Request, res : Response, next : NextFunction) {
    try {
    //get request from body
    const {action} = req.body;
    //set counter to 1 or -1 if action passed is like or unlike respectively.
    const counter = action == 'like' ? 1 : -1;
    const {username} = req.body; 
    const _id : String = req.params._id;
    //save status code.   
    const status = res.statusCode;
    // handle like action from the req.body
    if(action === 'like') {
      try {
        // check if user already liked the post
        await PostModel.find({_id, 'likes.likedBy': username})
        .then(async response =>{
          if(response.length == 0){
            // update if user hasn't liked te post
            try {
              await PostModel.update({_id: req.params._id}, {
                $inc: {
                  likesCount: counter
                },
                $push: {
                  likes: {
                      likedBy: username,
                      likedAt: new Date()
                  }
                }
                }).then(result=> {
                  const io = req.app.get('socketio');
                  io.emit(action, );
                // send result to client
                return res.send({message: `Sucessfully ${action} the post`, result: result, status: status});
                })
                
            } catch (error) {
              res.send({error: error});
            }
          } else {
            res.send({message: "user already liked the post"});
          }
        })
      } catch (error) {
        res.send({error: error});
      }
      
    } else if(action === 'unlike') {
      try {
        //check if user liked the post
        await PostModel.find({_id, 'likes.likedBy': username})
        .then(
          async response => {
            try {
              if (response.length !== 0 ) {
                // unlike since user has liked the post
                await PostModel.update({_id: req.params._id}, {
                  $inc: {
                    likesCount: counter
                  },
                  $pull: {
                    likes: {
                        likedBy: username
                    }
                  }
                  }).then(result=> {
                    const io = req.app.get('socketio');
                    io.emit(action, );
                    return res.send({message: `Sucessfully ${action} the post`, result: result, status: status});
                  })
              } else {
                res.send({message: "like this before unliking"});
              }
            } catch(error) {
              res.send({error})
            }
          }
        )
      } catch (error) {
        res.send({error})
      }
      
        
    }
    }catch(err){
      return res.send({error: err })
    } 
  }
}
