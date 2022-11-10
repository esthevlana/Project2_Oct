const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUser:
    {
      type: String,
      default: 'https://res.cloudinary.com/dwjj0oqwe/image/upload/v1668008376/WannaGo/playerone_2_zwiyii.png'
     },
     about: String,
     confirmedEvents: [{
      type: Schema.Types.ObjectId, ref: "Event"
     }],
     commentsUser: [{ 
      type: Schema.Types.ObjectId, ref: "Comment" 
    }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
