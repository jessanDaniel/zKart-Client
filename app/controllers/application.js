import Ember from 'ember';
// import $ from "jquery";

export default Ember.Controller.extend({
    userInfo : null,
    userSessionService : Ember.inject.service('user-session-service'),

    init() {
        this._super(...arguments);
        this.fetchUserInfo().then((response)=> {
            this.set('userInfo', response);
            console.log("userInfo..", this.get("userInfo"));
        }).catch(error => console.log(error));
    },

    fetchUserInfo() {
        return this.get("userSessionService").fetchUserInfo();
    },

    


})