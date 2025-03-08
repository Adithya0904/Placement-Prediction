const express=require('express')
const router=express.Router()

const predictionController=require("../controllers/predictionController.js")
const authController=require("../controllers/authController.js")

router.use(authController.protect)

router
.route('/')
.get(predictionController.getPredictions)
.post(predictionController.createPrediction)

router.get("/:id",predictionController.getPrediction)
module.exports=router