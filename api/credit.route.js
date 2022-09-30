import express from 'express'
import {initializeApp, } from 'firebase/app'
import {getDatabase, ref, get, set, child} from 'firebase/database'

const db_app = initializeApp({
    databaseURL: "https://jackpot-3fd0e-default-rtdb.firebaseio.com"
  });

const db = getDatabase(db_app)

const router = express.Router()

router.route('/:address').get((req, res, next) => {
    get(ref(db, `rewardslist/${req.params.address}`)).then((snapshot) => {
        if (snapshot.exists()) {
            res.json(snapshot.val());
        } else {
            res.json({ message: "No data available" });
        }
    }).catch(next);
})

router.route('/:address').put((req, res, next) => {
    set(ref(db, `rewardslist/${req.params.address}`), {
        Name: req.body.Name, 
        Partvalue: req.body.Partvalue, 
        Prize: req.body.Prize, 
        Totalvalue: req.body.Totalvalue
    }).then(() => {
        res.json({ message: 'success' })
    }).catch((err) => {})
})


export default router