import express from 'express'
import cors from 'cors'
import credit_route from './api/credit.route.js'


const app = express()
const port = 8000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
  }))


app.use('/jackpot', credit_route)

app.listen(port, () => console.log(`Listening on localhost: ${port}`))

export default app