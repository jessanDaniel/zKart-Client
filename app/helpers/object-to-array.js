import Ember from 'ember';

export function objectToArray([obj]) {
  return Object.keys(obj).map(key => {
    return { key, value: obj[key] };
  });
}

export default Ember.Helper.helper(objectToArray);
