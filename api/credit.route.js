import express from 'express'
import { initializeApp, } from 'firebase/app'
import { getDatabase, ref, get, set, child } from 'firebase/database'
import { emailPro } from '../common/emailPro.js'

const db_app = initializeApp({
  databaseURL: "https://jackpot-3fd0e-default-rtdb.firebaseio.com"
});

const db = getDatabase(db_app)

const router = express.Router()

router.route('/:address').get((req, res, next) => {
  get(ref(db, `addemail/${req.params.address}`)).then((snapshot) => {
    if (snapshot.exists()) {
      get(ref(db, `emailent/${snapshot.val()}`)).then((snapshot1) => {
        if (snapshot1.exists()) {
          res.status(200).send({ value: snapshot1.val() })
        }
        else { res.status(200).send({ value: 0 }) }
      }).catch(next)
    } else {
      res.status(200).send({ value: 0 })
    }
  }).catch(next);
})

router.route('/:address').put((req, res, next) => {
  get(ref(db, `addemail/${req.params.address}`)).then((snapshot) => {
    set(ref(db, `emailent/${snapshot.val()}`), req.body.value)
      .then(() => {
        res.json({ message: 'success' })
      }).catch(next)
  }).catch(next)
})

const updateEmailent = (req, res, next) => {
  get(ref(db, `emailent/${emailPro(req.body.user.email)}`)).then((snapshot) => {
    if (snapshot.exists()) {
      set(ref(db, `emailent/${emailPro(req.body.user.email)}`), snapshot.val() + req.body.entry.worth)
        .then(() => {
          res.json({ message: 'success' })
        })
        .catch((err) => { next(err) })
    }
    else {
      set(ref(db, `emailent/${emailPro(req.body.user.email)}`), req.body.entry.worth)
        .then(() => {
          res.json({ message: 'success' })
        })
        .catch((err) => { next(err) })
    }
  }).catch((err) => { next(err) })
}

const updateAddemail = (req, res, next) => {
  set(ref(db, `addemail/${req.body.entry.value}`), emailPro(req.body.user.email))
    .then(() => {
      res.json({ message: 'success' })
    })
    .catch((err) => { next(err) })
}

router.route('/').post((req, res, next) => {
  if(req.body.entry.status == 'valid') {
    if (req.body.entry.type == 'wallet_address') {
      updateAddemail(req, res, next)
      updateEmailent(req, res, next)
    }
    else updateEmailent(req, res, next)
  }
})


export default router