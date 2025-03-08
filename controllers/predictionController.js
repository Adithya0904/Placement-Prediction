const Prediction=require('D:\\PlacementPrediction-App\\models\\predictionModel.js')

exports.createPrediction=async(req,res)=>{
    try{
        console.log(req.body)
        const newPred=await Prediction.create(req.body)
        console.log("USER ID:",req.user)
        // console.log(newPred.userid)
        // console.log(newPred)

        //Here, to not get the output in ObjectId formate we use .toString()
        // console.log(newPred._id.toString())

        await Prediction.getPlacementStatus(newPred._id.toString())

        res.status(200).json({
            status:'success',
            id:newPred._id.toString()
        })
    }catch(err){
        res.status(200).json({
            status:'failed',
            data:{
                err
            }
    })}
}
exports.getPredictions=async(req,res)=>{
    try{
        const data=await Prediction.find()

        res.status(200).json({
            status:'success',
            count:data.length,
            data:{
                data
            }
        })
    }catch(err){
        res.status(200).json({
            status:'failed',
            data:{
                err
            }
    })}
}

exports.getPrediction=async(req,res)=>{
    try{
        const data=await Prediction.findById(req.params.id)

        if(!data){
            throw new Error("Data Does not exist!!")
        }

        res.status(200).json({
            status:'success',
            count:data.length,
            data:{
                data
            }
        })
    }catch(err){
        res.status(200).json({
            status:'failed',
            message:err.message
    })}
}