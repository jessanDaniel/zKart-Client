import Ember from 'ember';

export default Ember.Service.extend({
  isVisible: false,
  message: '',
  type: '',

  show(message, type) {
    this.setProperties({
      message,
      type,
      isVisible: true
    });

    Ember.run.later(this, function() {
      this.set('isVisible', false);
    }, 2000); 
  }
});
