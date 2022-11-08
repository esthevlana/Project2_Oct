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
        date: String,
        hour: String,
        price: String,
        city: {
          type: String,
          required: true,
        },
        imageUrl:
         {
          type: String,
          default: 'https://i.pinimg.com/564x/22/af/61/22af6132a5ff79cb80155291571743dd.jpg'
         },
        comments: [{
            type: Schema.Types.ObjectId, ref: "Comment",
        }],
        creator: {
            type: Schema.Types.ObjectId, ref: "User",
      },
        confirmed: [{
        type: Schema.Types.ObjectId, ref: "User",
  }],
    },
      {
        timestamps: true,
      }
    );
    
    const Event = model("Event", eventSchema);
    
    module.exports = Event;