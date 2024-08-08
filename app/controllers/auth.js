import Ember from 'ember';
import { get } from "@ember/object";
import {inject as service} from  "@ember/service";
import $ from "jquery";
import config from "z-kart/config/environment";

export default Ember.Controller.extend({
    ajax : service(),
    toastService : Ember.inject.service('toast-service'),
    // userSession : Ember.inject.service("user-session-service"),
    routing : Ember.inject.service("-routing"),

    isLogin: true,

    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",

    // query params
    

    //validation flags
    hasTyped: false,

    //admin config
    adminEmails : [],

    isPasswordEmpty: Ember.computed('password', function() {
        return this.password.length === 0;
    }),

    shouldShowValidation: Ember.computed('isPasswordEmpty', 'hasTyped', function () {
        return this.get('hasTyped') && !this.get('isPasswordEmpty') && !this.get('isLogin');
    }),

    hasDigit: Ember.computed('password', function () {
        return /\d/.test(this.get('password'));
    }),

    hasLower: Ember.computed('password', function () {
        return /[a-z]/.test(this.get('password'));
    }),

    hasUpper: Ember.computed('password', function () {
        return /[A-Z]/.test(this.get('password'));
    }),

    hasSymbol: Ember.computed('password', function () {
        return /[!@#$%^&*(),.?":{}|<>]/.test(this.get('password'));
    }),

    init() {
        this._super(...arguments);
        this.loadAdminEmails();
    },

    loadAdminEmails() {
        this.get('ajax').request('/client/assets/adminEmails.json')
        .then((data) => {
            this.set('adminEmails',data.adminEmails)
        } ).catch(error => console.log("error loading admin emails ", error));
    },

    resetProperties() {
        this.setProperties({
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            mobile: "",
            address: "",
            // userId: "0",
            // role: 'guest',
            hasTyped: false
        });
    },

    actions: {

        updateTypingState(event) {
            
            this.set('password',event)
            if (!this.get('hasTyped')) {
                this.set('hasTyped', true);
            }
        },

        toggleForm() {
            this.toggleProperty('isLogin')
        },

        handleSubmit(e) {
            console.log("i am here", e);
            console.log(this.email, " ", this.password);
            // e.preventDefault();

            let userObject = {};

            if (get(this, 'isLogin')) {
                userObject = {
                    email: this.email,
                    password: this.password
                }
                console.log(userObject);

                this.login(userObject);
            } else {
                if (get(this, 'password') === get(this, 'confirmPassword')) {
                    
                    // console.log("adminEmails ", this.get('adminEmails'));
                    let role = this.get('adminEmails').includes(this.get('email')) ? "1" : "0";

                    userObject = {
                        email: this.email,
                        password: this.password,
                        name: `${this.firstName} ${this.lastName}`,
                        mobile: this.mobile,
                        address: this.address,
                        role : role
                    }

                    console.log(userObject);
                    this.register(userObject);
                } else {
                    alert("the passwords do not match");
                }
            }
        },
        
    },

    login(userObject) {
        console.log("login : userObject : ", userObject);
        $.ajax(
            {
                // url: "http://localhost:8082/zKart/auth/login",
                url:`${config.API_AUTH_URL}/login`,
                method: "POST",
                contentType: 'application/json',
                data: JSON.stringify(userObject),
                xhrFields: {
                    withCredentials: true
                },
                success: (response) => {
                    console.log(response, "response from dummy json");
                    // this.get('userSession').setUserId(response.userId);
                    this.resetProperties();
                    
                    if(response.m_status_code=== 200) {
                        this.transitionToRoute("landing");
                        this.get("toastService").show(response.message, "success");
                    } else {
                        this.get("toastService").show(response.message, "error");
                    }
                },
                error: (error) => {
                    console.log(error, "error from dummyjson");
                    this.get("toastService").show(response.message, "error");
                }
            }
        )
    },

    register(userObject) {
        console.log("register : userObject : ", userObject);

        $.ajax({
            // url: "http://localhost:8082/zKart/auth/register",
            url:`${config.API_AUTH_URL}/register`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(userObject),
            xhrFields: {
                withCredentials: true
            },
            success: (response) => {
                console.log(response, "Response from register servlet");
                // this.get('userSession').setUserId(response.userId);
                this.set('userId', response.userId);
                this.resetProperties();
                this.transitionToRoute("landing");
            },
            error: (error) => {
                console.log(error, "Error in registering");
            }
        })
    },

  


});
