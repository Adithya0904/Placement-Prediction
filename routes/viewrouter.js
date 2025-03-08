const express=require('express')
const router=express.Router()
const viewController=require("../controllers/viewController.js")
const mongoose=require('mongoose')
const Prediction=require('D:\\PlacementPrediction-App\\models\\predictionModel.js')
const authController=require("D:\\PlacementPrediction-App\\controllers\\authController.js")
//To parse cookies in your Node.js server, you need to use a middleware like cookie-parser.
const cookieParser = require('cookie-parser');

router.use(cookieParser())
router.use(authController.logged)

router.route('/').get((req,res)=>{
    // console.log(res.locals.user)
    if(res.locals.user){
       // Redirect to the Home page if the user is authenticated
       return res.redirect('/Home');
    }else{res.status(200).render('login',{
        title:"log-in"
    })}  
})

router.route('/signup').get((req,res)=>{
   if(res.locals.user){
       // Redirect to the Home page if the user is authenticated
       return res.redirect('/Home');
    }else{res.status(200).render('sigin',{
        title:"Sign-in"
    })}
})

router.route('/Home').get((req,res)=>{
    // console.log(res.locals.user)
    if(res.locals.user){
        res.status(200).render('base',{
            title:"Home"
        })
    }else{
        return res.redirect('/')
    }
    
})

router.route('/Home/Results/:id').get(async (req, res) => {
    const id = req.params.id;
    if(res.locals.user){
    try {
        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ID format');
        }

        // Query the database
        const getresult = await Prediction.findById(id);

        // console.log(getresult)

        // Check if the document exists
        if (!getresult) {
            return res.status(404).send('Result not found');
        }

        // Render the view
        res.status(200).render('result', {
            title: "Prediction",
            getresult,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }}
    else{
        return res.redirect('/')
    }
});

module.exports=router