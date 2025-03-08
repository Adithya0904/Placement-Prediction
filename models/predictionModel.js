const mongoose=require('mongoose')
const validator=require('validator')
const { spawn }=require('child_process')

const predictionSchema=mongoose.Schema({
    tenthPercentage: {
        type: Number,
        required: true, // Fix typo
        min: [40, "10th Percentage should be greater than 40%"],
        max: [100, "10th Percentage should be less than or equal to 100%"],
        // default:40
    },
    twelthPercentage: {
        type: Number,
        required: true, // Fix typo
        min: [40, "12th Percentage should be greater than 40%"],
        max: [100, "12th Percentage should be less than or equal to 100%"],
        // default:40
    },    
    CGPA:{
        type:Number,
        required:true,
        min:[5,"CGPA should be greater than 5"],
        max: [10, "CGPA should be less than or equal to 10"],
        // default:5
    },
    CommunicationSkillRatings:{
        type:Number,
        required:true,
        min:[1,"CommunicationSkillRatings should be greater than or equal to 1"],
        max: [5, "CommunicationSkillRatings should be less than or equal to 5"],
        // default:1
    },
    MajorProjects:{
        type:Number,
        default:0
    },
    MinorProjects:{
        type:Number,
        default:0
    },
    WorkshopsCertificates:{
        type:[String],
        default:["null"],
        validate:[
            {
                validator: function(certificates)
                {
                // console.log(certificates);
                const bool = certificates.every(cert => typeof cert === 'string');
                console.log(bool);
                return bool; // Ensure the function returns the result
                },
                message: "Certificates should be of the type String"
            },
            {
                validator: function(certificates)
                {
                    return new Set(certificates).size===certificates.length
                },
                message:"No Duplicate certificates Allowed!!"
            }
    ]
    },
    Internship:{
        type:String,
        default:"No",
        enum:["Yes","No"]
    },
    Hackathon:{
        type:String,
        default:"No",
        enum:["Yes","No"]
    },
    Backlog:{
        type:Number,
        required:true
        // default:0
    },
    certificateCount:{
        type:Number,
    },
    PlacementStatus:{type:String},
    userid:{
        type:mongoose.Schema.ObjectId,
        ref: "User"
    }
})

predictionSchema.pre('save',function(next){
    if (this.WorkshopsCertificates){
        this.certificateCount=this.WorkshopsCertificates.length
    }else{
        this.certificateCount=0
    }
    next()
})

// predictionSchema.pre(/^find/,(next)=>{
//     this.populate={
//         path:"userid"
//     }
// })

predictionSchema.statics.getPlacementStatus = async function(Id) {
    console.log(Id);
    const data = await this.findById(Id);
    console.log(data)

    if (!data) {
        throw new Error('No data found with the given ID.');
    }

    const {
        tenthPercentage: tenth,
        twelthPercentage: twelth,
        CGPA: cgpa,
        CommunicationSkillRatings: communicationskills,
        MajorProjects: majorproject,
        MinorProjects: miniproject,
        WorkshopsCertificates: workshops,
        Internship: internship,
        Hackathon: hackathon,
        Backlog: backlogs,
    } = data;

    // Spawn Python process
    const python = spawn('python3', [
        'result.py',
        tenth,
        twelth,
        cgpa,
        communicationskills,
        majorproject,
        miniproject,
        workshops.length,
        internship,
        hackathon,
        backlogs,
    ]);

    // Capture Python output
    python.stdout.on('data', async (output) => {
        console.log(`Python Output: ${output.toString()}`);
        try{
            await this.findByIdAndUpdate(Id,{PlacementStatus:output.toString().trim()})
            // data.PlacementStatus=output.toString()
            await data.save()
            // console.log(data.PlacementStatus)

        }catch(err){
            throw new Error(err)
        }
    });

    // Capture Python errors
    python.stderr.on('data', (error) => {
        console.error(`Error: ${error.toString()}`);
    });

    // Handle when the process ends
    python.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });

};


const Prediction=mongoose.model('Prediction',predictionSchema)

module.exports=Prediction