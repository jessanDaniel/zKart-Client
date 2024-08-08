import Ember from 'ember';
import $ from "jquery";
import config from "z-kart/config/environment";

export default Ember.Service.extend({
    getOrderItems(userId){
        return new Ember.RSVP.Promise((resolve, reject) => {
            $.ajax({
                url:`${config.API_URL}/user/${userId}/order`,
                method: "GET",
                contentType:"application/json",
                xhrFields : {
                    withCredentials : true
                },
                success : (response) => {
                    resolve(response)
                },
                error : (error) => {
                    reject(error)
                }
            })
        })
    }
});
