import express from 'express'
import { initializeApp, } from 'firebase/app'
import { getDatabase, ref, get, set, child, enableLogging } from 'firebase/database'
import { emailPro } from '../common/emailPro.js'
import axios from 'axios'

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

// const updateEmailent = (req, res, next) => {
//   get(ref(db, `emailent/${emailPro(req.body.user.email)}`)).then((snapshot) => {
//     if (snapshot.exists()) {
//       set(ref(db, `emailent/${emailPro(req.body.user.email)}`), snapshot.val() + req.body.entry.worth)
//         .then(() => {
//           res.json({ message: 'success' })
//         })
//         .catch((err) => { next(err) })
//     }
//     else {
//       set(ref(db, `emailent/${emailPro(req.body.user.email)}`), req.body.entry.worth)
//         .then(() => {
//           res.json({ message: 'success' })
//         })
//         .catch((err) => { next(err) })
//     }
//   }).catch((err) => { next(err) })
// }

// const updateAddemail = (req, res, next) => {
//   set(ref(db, `addemail/${req.body.entry.value}`), emailPro(req.body.user.email))
//     .then(() => {
//       res.json({ message: 'success' })
//     })
//     .catch((err) => { next(err) })
// }

// router.route('/').post((req, res, next) => {
//   if(req.body.entry.status == 'valid') {
//     if (req.body.entry.type == 'wallet_address') {
//       updateAddemail(req, res, next)
//       updateEmailent(req, res, next)
//     }
//     else updateEmailent(req, res, next)
//   }
// })
router.route('/noncomp/:address').get((req, res, next) => {
  get(ref(db, `noncomp/${req.params.address}`)).then((snapshot) => {
    if (snapshot.exists()) {
      res.status(200).send({ value: snapshot.val() })
    }
    else {
      res.status(200).send({ value: 0 })
    }
  }).catch((err) => { next(err) })
})
router.route('/noncomp').post((req, res, next) => {
  get(ref(db, `noncomp/${req.body.address}`)).then((snapshot) => {
    if (snapshot.exists()) {
      set(ref(db, `noncomp/${req.body.address}`), snapshot.val() + req.body.reward)
        .then(() => {
          res.json({ message: 'success' })
        })
        .catch((err) => { next(err) })
    }
    else {
      set(ref(db, `noncomp/${req.body.address}`), req.body.reward)
        .then(() => {
          res.json({ message: 'success' })
        })
        .catch((err) => { next(err) })
    }
  })
}
)

const proData = (updata2, data) => {
  data.forEach((ele) => {
    if (ele.status == 'Valid') {
      if (ele.action.type == 'wallet_address') {
        updata2.addemail[ele.value] = emailPro(ele.email)
      }
      updata2.emailent[emailPro(ele.email)] ? updata2.emailent[emailPro(ele.email)] += ele.worth : updata2.emailent[emailPro(ele.email)] = ele.worth
    }
  })
  return updata2
}

const getActions = async (updata1, compid) => {
  const token = 'QbI4o1BNdGKjGzg8'
  const apiEndpoint = `https://gleam.io/api/v2/sites/2044179/competitions/${compid}/actions?per_page=500`
  const actions = await axios.get(apiEndpoint, { headers: { Authorization: `Token ${token}` } })
  updata1 = proData(updata1, actions.data.data)
  if (actions.data.pagination.total_pages > 1) {
    for (let i = 2; i <= actions.data.pagination.total_pages; i++) {
      const apiEnd = `https://gleam.io/api/v2/sites/2044179/competitions/${compid}/actions?page=${i}&per_page=500`
      const actions1 = await axios.get(apiEnd, { headers: { Authorization: `Token ${token}` } })
      updata1 = proData(updata1, actions1.data.data)
    }
  }
  return updata1
}
export const dailyUpdate = async () => {
  let updata = {
    addemail: {},
    emailent: {}
  }
  const camps = ['VzFR5', 'baTVR', 'ygi5N', 'tJJbG', 'TvJRI', 'ryyZQ', 'yjzVW', 'gmbJ9', 'otY3K', 'jvpgZ', 'FCg45']
  for (const camp of camps) {
    updata = await getActions(updata, camp)
  }
  set(ref(db, '/'), updata).then(() => {
    console.log('success');
  })
}

export default router