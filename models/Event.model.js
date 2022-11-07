const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
    {
        title: {
          type: String,
          required: true,
          },
        description: {
          type: String,
          required: true,
          },
        city: {
          type: String,
          required: true,
        },
        imageUrl: String,
        comments: {
            type: Schema.Types.ObjectId, ref: "Comment",
        },
        users: {
            type: Schema.Types.ObjectId, ref: "User",
      },
    },
      {
        timestamps: true,
      }
    );
    
    const Event = model("Event", eventSchema);
    
    module.exports = Event;