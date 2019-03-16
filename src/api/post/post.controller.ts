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

      //
      // Response
      return res.send({message: 'Sucessfully updated a post', result: result, status: status});
    } catch (err) {

      //
      // Error response
      res.send({message: 'Could not update the post', err: err});
    }
  }

}
