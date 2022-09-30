import rewardsList from './rewardsList.json' assert { type: "json" };
import {initializeApp} from 'firebase/app'
import {getDatabase, ref, set} from 'firebase/database'
import serviceAccount from '../common/serviceAccountKey.json' assert { type: "json" };

const db_app = initializeApp({
    databaseURL: "https://jackpot-3fd0e-default-rtdb.firebaseio.com"
  });

const db = getDatabase(db_app)

const RewardsListProcess = () => {

  const processed = rewardsList.reduce((res, obj) => {
    const temp_obj = {}
    // temp_obj[obj.Address] = {}
    temp_obj['Name'] = obj.Name
    temp_obj['Partvalue'] = obj.Partvalue
    temp_obj['Prize'] = obj.Prize
    temp_obj['Totalvalue'] = obj.Totalvalue
    return {...res, [obj.Address]: temp_obj}
  }, {})

  return {'rewardslist' : {...processed}} 
}

set(ref(db), RewardsListProcess())