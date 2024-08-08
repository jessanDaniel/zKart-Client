import Ember from 'ember';

export default Ember.Service.extend({
  isLoading: false,

  show() {
    this.set('isLoading', true);
  },

  hide() {
    this.set('isLoading', false);
  }
});
