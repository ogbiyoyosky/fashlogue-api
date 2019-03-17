import * as mongoose from 'mongoose';
export interface IPost extends mongoose.Document {
    author: String;
    permlink: String;
    postTitle: String;
    postDescription: String;
    category: String;
    postImage: String;
    comments: [String];
    likesCount: Number;
    viewsCount: Number,
    likes: [
        {
            likedBy: String,
            likedAt: Date
        }
    ];
    views: [String];
    tags: [String];
    postedTo: [String];
    createdAt: Date;
    modifiedAt: Date;
}