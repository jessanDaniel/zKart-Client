import Ember from 'ember';

export default Ember.Component.extend({
  toast: Ember.inject.service("toast-service"),
  classNames: ['toast-message-container'],
  isVisible: Ember.computed.readOnly('toast.isVisible'),
  message: Ember.computed.readOnly('toast.message'),
  type: Ember.computed.readOnly('toast.type'),

  actions: {
    closeToast() {
      this.set('toast.isVisible', false);
    }
  }
});
