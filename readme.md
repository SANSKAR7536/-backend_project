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



  # login user 

  1-  take the data from the body . through request 
  2- username and email do find one to login 
  3- find the user  and check the user 
  4- access and refresh token   form the model iteself
  5- send  data and token through cookies
  

  # subscription model

  1- one channnel is also a user .
  2- subscriber are also a user .
  3-  take user and store it on differenet 

  # subsciption model undeerstanding 

  1- why the  understanding is needed  i want to know why ---?????
     
      subscrpiton schema --

       it has two mahor things subscriber and channel  both are user  just value 

       let  user be a,b,c,d, and channel be like chai , hcc,fcc, both are user but for understanfding keep it simple 

        jitni bar ek channel ko subscribe utni bar model banega  document 

        let say channel =cac, sub a
        let say channel be cac, and sub be like b,
        let say channle be like cac and sas be like c, adn asloo subsribe to fccc.

         but b say channel hcc  ko subscribe karo 


        sooo it all  are a document 
         major quest how to find the channel no=umber of subscriber and followers

      notes-- let say for cac  select those document whose channel are caa..    //3 subsciber 

       why not suibscirber count kre 

       let say shannel subscirbed for c  find the subsriber ki value c kaha kaha h ,, channel ki list nikal ke le lao 



  # mongo db  aggreation pipeline  understanding ---

      read where --  read document on mongodb

       stages each stage perform opertion  which stays on the other next satges..


        let sya we have opperaion on one stages like 50, so in the next stage we are going to  present yah operate on the 50 data only 

        synatx --  db .<kaha laga na h >. agggreate 


        [
          {
            $match
          },{
            $lookup:
            form  :kaha se join karu 
            localfield:

          },{} // pipielines 
        ]

         yeh array  of object ayega return me 
          if we want  ki array nah aye -- {
            $addfield  new filed add akarega 
          }



          











      