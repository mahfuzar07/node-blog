//name email password and profile
const { Schema, model } = require('mongoose');
const Comment = require('./Comment');

const postSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: {
      type: [String],
      required: true,
    },
    thumbnail: String,
    readTime: String,
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: Comment,
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.index(
  {
    title: 'text',
    body: 'text',
    tags: 'text',
  },
  {
    weights: {
      title: 5,
      tags: 5,
      body: 2,
    },
  }
);

const Post = model('Post', postSchema);
module.exports = Post;
