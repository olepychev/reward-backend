import entry from './entry.json' assert { type: "json" };
import {initializeApp} from 'firebase/app'
import {getDatabase, ref, set} from 'firebase/database'
import {emailPro} from '../common/emailPro.js';
import axios from 'axios'

const token = 'QbI4o1BNdGKjGzg8'

// const apiEndpoint = 'https://gleam.io/api/v2/sites/2044179/competitions/ryyZQ/actions?per_page=200&entry_method_id=6730042'
// const wallet = await axios.get(apiEndpoint, { headers: { Authorization: `Token ${token}` } })
// const add = wallet.data.data.reduce((res, arr) => {
//   return {...res, [arr.email] : {'address' : arr.value,
//                                 'entry' : 0}}
// }, {})

// const apiEndpoint1 = 'https://gleam.io/api/v2/sites/2044179/competitions/ryyZQ/actions?page=1&per_page=500'
// const comp = await axios.get(apiEndpoint1, { headers: { Authorization: `Token ${token}` } })
// comp.data.data.forEach(element => {
//   if(element.status == 'Valid' && add[element.email]) {
//     add[element.email]['entry'] += element.worth
//   }
// });
// console.log(add);
// const apiEndpoint2 = 'https://gleam.io/api/v2/sites/2044179/competitions/ryyZQ/actions?page=2&per_page=500'
// const comp1 = await axios.get(apiEndpoint2, { headers: { Authorization: `Token ${token}` } })
// comp1.data.data.forEach(element => {
//   if(element.status == 'Valid' && add[element.email]) {
//     add[element.email]['entry'] += element.worth
//   }
// });
// const apiEndpoint3 = 'https://gleam.io/api/v2/sites/2044179/competitions/ryyZQ/actions?page=3&per_page=500'
// const comp2 = await axios.get(apiEndpoint3, { headers: { Authorization: `Token ${token}` } })
// comp2.data.data.forEach(element => {
//   if(element.status == 'Valid' && add[element.email]) {
//     add[element.email]['entry'] += element.worth
//   }
// });
// const apiEndpoint4 = 'https://gleam.io/api/v2/sites/2044179/competitions/ryyZQ/actions?page=4&per_page=500'
// const comp3 = await axios.get(apiEndpoint4, { headers: { Authorization: `Token ${token}` } })
// comp3.data.data.forEach(element => {
//   if(element.status == 'Valid' && add[element.email]) {
//     add[element.email]['entry'] += element.worth
//   }
// });
// console.log(add);


// Object.keys(entry).forEach((key) => {
//   if(entry1[key]) entry1[key]['entry'] += entry[key]['entry']
//   else entry1 = {...entry1, [key] : entry[key]}
// })
// console.log(entry1);
let addEmail = {}
Object.keys(entry).forEach((key) => {
  addEmail = {...addEmail, [entry[key]['address']] : emailPro(key)}
})

let emailEnt = {}
Object.keys(entry).forEach((key) => {
  emailEnt = {...emailEnt, [emailPro(key)] : entry[key]['entry']}
})

const db_app = initializeApp({
    databaseURL: "https://jackpot-3fd0e-default-rtdb.firebaseio.com"
  });

const db = getDatabase(db_app)


// const RewardsListProcess = () => {

//   const processed = rewardsList.reduce((res, obj) => {
//     const temp_obj = {}
//     // temp_obj[obj.Address] = {}
//     temp_obj['Name'] = obj.Name
//     temp_obj['Partvalue'] = obj.Partvalue
//     temp_obj['Prize'] = obj.Prize
//     temp_obj['Totalvalue'] = obj.Totalvalue
//     return {...res, [obj.Address]: temp_obj}
//   }, {})

//   return {'rewardslist' : {...processed}} 
// }

set(ref(db, '/emailent'), emailEnt)
set(ref(db, '/addemail'), addEmail)