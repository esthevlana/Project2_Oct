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
      default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fdefault-user&psig=AOvVaw3GtVk-jrfAn72xSZ1dD1wF&ust=1668084469020000&source=images&cd=vfe&ved=2ahUKEwi-p4-DkaH7AhVvrXIEHW2BCksQjRx6BAgAEAw'
     },
     about: String,
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
