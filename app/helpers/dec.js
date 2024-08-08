import Ember from 'ember';

export function dec([value]) {
  return value - 1;
}

export default Ember.Helper.helper(dec);
