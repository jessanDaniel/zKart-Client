import Ember from 'ember';

export default Ember.Component.extend({
  loading: Ember.inject.service(),
  classNames: ['loading-spinner'],
  classNameBindings: ['loading.isLoading:visible:hidden'],

  
});
