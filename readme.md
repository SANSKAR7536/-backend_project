#   backend project  #
# put the monodb_uri in back tig 

# steps for the authorisation  and register the user 
  1-get user dteails form frontend or postman ( depends on the usermodel )

  2- validation (if emppty or email is in correct format )
  
  3- check if  user already exist or not ( check by any othe attribute  here  by email )

  4-  cheeck avatar and image  
  
  5- upload to cloudinary, check for avatar

  6- check  create user object for mongodb  creation try  db call 

  7-  remove password and refresh token fee - from response 

  8- check for user creation 
  
  9- return response