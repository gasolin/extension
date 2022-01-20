import { combineReducers } from "redux"

import accountsReducer from "./accounts"
import assetsReducer from "./assets"
import activitiesReducer from "./activities"
import keyringsReducer from "./keyrings"
import swapReducer from "./0x-swap"
import transactionConstructionReducer from "./transaction-construction"
import uiReducer from "./ui"
import dappPermissionReducer from "./dapp-permission"
import signingReducer from "./signing"

const mainReducer = combineReducers({
  account: accountsReducer,
  assets: assetsReducer,
  activities: activitiesReducer,
  keyrings: keyringsReducer,
  swap: swapReducer,
  transactionConstruction: transactionConstructionReducer,
  ui: uiReducer,
  dappPermission: dappPermissionReducer,
  signing: signingReducer,
})

export default mainReducer

export type RootState = ReturnType<typeof mainReducer>
