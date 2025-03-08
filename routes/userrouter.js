const express=require("express")
const router=express.Router()
const authController=require("D:\\PlacementPrediction-App\\controllers\\authController.js")

router.route("/signIn").post(authController.signin)
router.route("/logIn").post(authController.login)
router.route("/logOut").get(authController.logout)

module.exports=router