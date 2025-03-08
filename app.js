const express=require('express')
const mongoose=require('mongoose')
const morgan=require('morgan')
const path=require('path')
const pug = require('pug')
const cors = require('cors')
const detenv=require('dotenv')

const predictionRouter = require('./routes/predictionrouter.js');
const userRouter = require('./routes/userrouter.js');
const viewRouter = require('./routes/viewrouter.js');
const Prediction=require('D:\\PlacementPrediction-App\\models\\predictionModel.js')


const app=express()

detenv.config({path: './config.env'})
app.use(cors());


// This tells Express to use pug as the view engine
app.set('view engine', 'pug')
// This specifies the directory where your Pug templates are stored
app.set('views', path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'))
app.use(express.json())

app.use('/api/prediction',predictionRouter)
app.use('/api/auth',userRouter)
app.post('/submit', async(req, res) => {
    // Handle the POST request

        console.log(req.body); // You can check the submitted data here
        const newPred=await Prediction.create(req.body)
        await Prediction.getPlacementStatus(newPred._id.toString())
        // res.json({ message: 'Data received successfully' });

        res.status(200).json({
            message:'success',
            id:newPred._id.toString()
    })
});

app.use('/',viewRouter)

// app.get('/',(req,res)=>{
//     res.status(200).render('login',{
//         title:"log-in"
//     })
// })

// app.get('/signup',(req,res)=>{
//     res.status(200).render('sigin',{
//         title:"sign-in"
//     })
// })

// app.get('/Home',(req,res)=>{
//     res.status(200).render('base',{
//         title:"Home"
//     })
// })

// app.get('/Home/Results/:id', async (req, res) => {
//     const id = req.params.id;

//     try {
//         // Validate the ID format
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).send('Invalid ID format');
//         }

//         // Query the database
//         const getresult = await Prediction.findById(id);

//         // console.log(getresult)

//         // Check if the document exists
//         if (!getresult) {
//             return res.status(404).send('Result not found');
//         }

//         // Render the view
//         res.status(200).render('result', {
//             title: "Prediction",
//             getresult,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server error');
//     }
// });



const DB=process.env.DB
mongoose.connect(DB,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false,
    useUnifiedTopology: true,
}).then(()=> console.log('DB connection successfully'))

const PORT=8000
app.listen(PORT,()=>{
    console.log(`App listening to port ${PORT}........`)
})