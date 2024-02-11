# Project Name
Natours
## Description
Natours is a Fullstack web app to booking tours 

## Technologies Used
build with Nodejs , express , mongodb ,mongoose as odm , Pug for server side rendaring , html ,css , Typescript And Postman to test APIs

## Features and Functionality
  ### User
    -Update username, photo, email, password, and other information
    -User Can be one of [Admin , user , guide , lead-guide] , by default User
    -each User can Create one Review on each Tour
  ### Tour 
    -can be created by an admin user or a lead-guide only
    -can be seen by every user.
    -can be updated by an admin user or a lead guide only
    -Tours can be deleted by an admin user or a lead-guide only
    - each Tour have Reviews
  ### Review
    -Only regular users can write reviews for tours that they have booked
    -All users can see the reviews of each tour.
    -Regular users and admin can edit and delete their own reviews.
    -Regular users can Review Only Once on each Tour
  ### Booking
    -Only regular users can book tours by payment Only Once
    -Regular users can see all the tours they have booked.
    -admin user or a lead guide can see every booking on the app.
    -admin user or a lead guide can delete any booking.
    -admin user or a lead guide can create a booking manually,without payment
    -admin user or a lead guide can not create a booking for the same user twice.
    -admin user or a lead guide can edit any booking.
  ### Authentication and Authorization
    - User Can Sign up, Log in, Logout, Update and reset password 
    - all passwords hashed on DB 
    - User Types is User , Admin , guide , admin guide Only
