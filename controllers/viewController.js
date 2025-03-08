const express=require('express')
const Prediction=require('D:\\PlacementPrediction-App\\models\\predictionModel.js')


exports.getResults=async(req,res)=>{
    const result=await Prediction.findById(req.params.id)

    res.status(200).render({
        title:"Result",
        result
    })
}