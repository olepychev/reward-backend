import express from 'express'
import cors from 'cors'
import credit_route, {dailyUpdate} from './api/credit.route.js'


const app = express()
const port = process.env.PORT || 8000

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
  }))


app.use('/jackpot', credit_route)

setInterval(dailyUpdate, 60*60*24*1000)

app.listen(port, () => console.log(`Listening on localhost:${port}`))
