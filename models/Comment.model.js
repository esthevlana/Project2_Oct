const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    content: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
/*     profilePicture: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }, */
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;

