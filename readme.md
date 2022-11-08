WannaGo

Description
A platform to discover upcoming events and connect people based on location and personal interests.

User Stories
    • 404 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
    • 500 - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
      -homepage - As a user I want to be able to access the homepage and filter by type of events, date and location, log in and sign up.
    • sign up - As a user I want to sign up on the web page so I can create a personal profile with my location to discover different activities and meet knew people.
    • login - As a user I want to be able to log in on the web page so that I can get back to my account.
    • logout - As a user I want to be able to log out from the web page so that I can make sure no one will access my account
    • Home – As a user I want to set my location date and type of activities and see what upcoming events are going to happen in the city 
    • Event page – As a user I want to see more details about the event I’m interest for, such as date, location, if it’s necessary to buy tickets and description. And be able to see a few comments of the people that also are interested on going.
    • Forum page – It’s a chat area so the user can talk to other users interested for the same event.
    • Add event – As a user I want to be able to create my own event.
    • Notification area - As a user I want to see all the notifications related to the events I wannt to go and the private messages received from other users.
    • Private message section – A page to have access to all the private messages from other users.
    • Calendar – Be able to access all the events marked as confirmed.
    • Profile - As a user I want to be able to edit my profile, my favourite or confirmed events and my friends.

Server Routes (Back-end):

Method   Route          Description                         Request - Body
GET      /              Main page route. 
                        Renders home index view

GET      /login         Renders login form view.

POST     /login         Sends Login form data to            { email, password }
                        the server.

GET      /signup        Renders signup form view.

POST     /signup        Sends Sign Up info to the           { email, password, username, location, description, profile picture }
                        server and creates user in 
                        the DB.

GET      /private       Private route. Renders 
         /edit-profile  edit-profile form view.

PUT      /private       Private route. Sends edit-profile    { [imageUrl] , Description, 
         /edit-profile  info to server and updates user       Location}
                        in DB.

GET     /profile        If the user is loggedin

POST    /logout         User to be able to logout

GET     /events         Renders all the events avaiable

GET     /events/:id     Return events after a search for
                        some key-word

GET     /events/create  Render the form to create an event

POST    /events/create  Create an event                      {title, description, city, imageURL}

GET     /events/edit/   Render the form to edit an event
        :id

POST    /events/edit/    Edit the event                      {title, description, city, imageURL}
        :id

POST    /events/delete/  Delete the event
        :id

GET     /comment         Show most recent comments

GET     /comment/create  Render the form to create a comment

POST    /comment/create  Create the comment                   {author, content}

POST    /comment/delete/ Delete the comment
        :id  




Models

User model
{
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
    },
  password: {
    type: String,
    required: true,
    }
  city: {
    type: String,
    required: true,
    }
   location: String,
   description: String,
   favorites: ObjectID Event,
   createComments: [
      {type: Schema.Types.ObjectId, ref: "Comment"}
    ]
}

Event Model 
{
  title: {
    type: String,
    required: true,
    }
  description: {
    type: String,
    required: true,
    }
  city: {
    type: String,
    required: true,
  }
  imageUrl: String
  comments: ObjectID "Comments"
  users: ObjectID "User"
}

Comment Model {
  author: {
    type: Schema.Types.ObjectId,
    }
    content: String,
    ref: "username"
}




// Event Model
 - Get all
 - get details
 - post (to create)
 - post (to edit)
 - post (to delete)

 // Comments 
  - post (to create)