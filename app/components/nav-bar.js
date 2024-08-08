import Ember from 'ember';
import $ from "jquery";
// import {inject as service} from "@ember/service";

export default Ember.Component.extend({
    router : Ember.inject.service("-routing"),
    // cookies : Ember.inject.service("cookies"),
    // userSession : Ember.inject.service('user-session-service'),
    userInfo : null,
    
    
    isAdminRoute : Ember.computed(function(){
        // console.log(this.get('router.currentRouteName'));
        return this.get('router.currentRouteName') === "dashboard";
    }),

    sessionPresent : Ember.computed(function() {
        console.log(this.get('userInfo'), "userInfo");
        if(this.get('userInfo') !== null && this.get('userInfo.m_status_code') !== 404) {
            return true; 
        } else {
            return false;
        }
    }),

    isAdmin: Ember.computed(function(){
        let role = this.get('userInfo.user_role');
        console.log("role", role);
        return role === 1;
    }),

    init() {
        this._super(...arguments);
    },

    actions : {
      performAction() {
        if(this.get('sessionPresent') && this.get('isAdminRoute')) {
            console.log(this.get('sessionPresent') && this.get('isAdminRoute'));
            this.logout().then(()=> {
                if(!this.isDestroyed || !this.isDestroying) {
                    this.set('userInfo', null);
                    this.sendAction('setUserNull');
                    this.get('router').transitionTo("landing");
                }
            });        
        } else if(this.get('sessionPresent')) {
            this.logout().then(()=> {
                if(!this.isDestroyed || !this.isDestroying) {
                    this.set('userInfo', null);
                    this.sendAction('setUserNull');
                    this.get('router').transitionTo("landing");
                }
            });
        }  else {
            this.redirectToAuth();
        }
      },

      cartAction(){
          this.sendAction('routeToCart');
        },
        
        orderAction() {
          console.log("here");
        this.sendAction("routeToOrder");
      },

      goToHome(){
        this.get('router').transitionTo("landing");
      },

      redirectToDashboard() {
        this.get("router").transitionTo("dashboard");
    }
    },
      
        
    // },

    redirectToAuth() {
        this.get('router').transitionTo("auth");
    },

    

    logout() {
        return new Ember.RSVP.Promise((resolve, reject) => {

            $.ajax({
                url:"http://localhost:8082/zKart/auth/logout",
                method:"POST",
                contentType:"application/json",
                data:JSON.stringify({}),
                xhrFields : {
                    withCredentials : true 
                }, 
                success : (response) => {
                    this.set('sessionPresent', false);
                    // this.get('userSession').clearSession();
                    if(this.isDestroyed || this.isDestroying) {
                        return;
                    }
                    if(response['status code'] === 200) {
                        resolve();
                    }
                }, 
                error : (error) => {
                    console.log(error);
                    reject();
                }
            })
        })
    },
});
 