/*
Aggregation Logics
*/
export const generalAggregation = function (
  totalStorage: any,
  action: string,
  token: string,
  amount: number
) {
  /*   
        Saving the  aggregated info in a map, to allow an average O(1) access
    */

  if (!totalStorage[token]) {
    totalStorage[token] = {};
    totalStorage[token][action] = {};
    totalStorage[token][action]["amount"] = amount;
  } else if (!totalStorage[token][action]) {
    totalStorage[token][action] = {};
    totalStorage[token][action]["amount"] = amount;
  } else {
    totalStorage[token][action]["amount"] += amount;
  }
};

export const timedAggregation = function (
  timedStore: any,
  timestamp: number,
  action: string,
  token: string,
  amount: number
) {
  /*   
        Saving the  aggregated info in a map, to allow an average O(1) access
    */

  if (!timedStore[timestamp]) {
    timedStore[timestamp] = {};
    timedStore[timestamp][token] = {};
    timedStore[timestamp][token][action] = {};
    timedStore[timestamp][token][action]["amount"] = amount;
  } else if (!timedStore[timestamp][token]) {
    timedStore[timestamp][token] = {};
    timedStore[timestamp][token][action] = {};
    timedStore[timestamp][token][action]["amount"] = amount;
  } else if (!timedStore[timestamp][token][action]) {
    timedStore[timestamp][token][action] = {};
    timedStore[timestamp][token][action]["amount"] = amount;
  } else {
    timedStore[timestamp][token][action]["amount"] += amount;
  }
};
