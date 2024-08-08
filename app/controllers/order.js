import Ember from 'ember';

export default Ember.Controller.extend({
    actions : {
        routeToLanding(){
            this.transitionToRoute("landing");
        }
    }
});
