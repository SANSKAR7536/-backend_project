//  as a middleware use  the multer form ; 

import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, './public/photos')
},
  filename:  (req, file, cb) =>{
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.originalname + '-' + uniqueSuffix)

     cb(null, file.originalname)
  }
})

 export const upload = multer({ 
      storage,

 })




