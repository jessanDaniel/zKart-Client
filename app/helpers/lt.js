import Ember from 'ember';

export function lt(params/*, hash*/) {
  return params[0] < params[1];
}

export default Ember.Helper.helper(lt);
