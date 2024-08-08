import Ember from 'ember';
import $ from "jquery";
import config from "z-kart/config/environment";


export default Ember.Service.extend({
    userInfo : null ,

    fetchUserInfo() {
        return new Ember.RSVP.Promise((resolve, reject)=>{
            $.ajax({
                // url:"http://localhost:8082/zKart/api/v1/user/info",
                url:`${config.API_URL}/user/info`,
                method:"GET",
                contentType : "application/json",
                xhrFields : {
                    withCredentials : true 
                },
                success : (response) => {
                    resolve(response);
                }, 
                error : (error) => {
                    reject(error)
                }
            })
        })
    },

    setUSerInfoNull(){
        this.set('userInfo', null);
    }
});
