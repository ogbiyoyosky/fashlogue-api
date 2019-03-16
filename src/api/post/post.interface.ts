import * as mongoose from 'mongoose';
export interface IPost extends mongoose.Document {
    author: String;
    permlink: String;
    postTitle: String;
    postDescription: String;
    category: String;
    postImage: String;
    comments: [String];
    likes: Number;
    views: Number;
    tags: [String];
    postedTo: [String];
    createdAt: Date;
    modifiedAt: Date;
}