import Ember from 'ember';
import $ from 'jquery';
import config from "z-kart/config/environment";

export default Ember.Service.extend({

    addToCart(cartObj){
        let cartId = cartObj.cartId;
        let productId = cartObj.productId;
        let quantity = cartObj.quantity;
        let dataObj = {productId, quantity};

        return new Ember.RSVP.Promise((resolve, reject) => {
            $.ajax({
                url:`${config.API_URL}/user/${cartId}/cart`,
                method:"POST",
                data : JSON.stringify(dataObj),
                contentType : "application/json",
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

    },

    getCartItems(cartId){
        return new Ember.RSVP.Promise((resolve, reject) => {
            $.ajax({
                url : `${config.API_URL}/user/${cartId}/cart`,
                method:"GET",
                contentType : "application/json",
                xhrFields:{
                    withCredentials : true 
                },
                success : (response) => {
                    resolve(response);
                },
                error : (error) => {
                    reject(error);
                }
            })
        })
    },

    updateCartItem(cartId, cartObj){
        return new Ember.RSVP.Promise((resolve, reject)=>{
            $.ajax({
                url:`${config.API_URL}/user/${cartId}/cart`,
                method : "PUT",
                data:JSON.stringify(cartObj),
                contentType : "application/json",
                success : (response) => {
                    resolve(response)
                },
                error : (error) => {
                    reject(error)
                }
            })
        })
    },

    deleteCartItem(cartId,itemId) {
        return new Ember.RSVP.Promise((resolve, reject)=>{
            $.ajax({
                url : `${config.API_URL}/user/${cartId}/cart/${itemId}`,
                method : "DELETE",
                contentType : "application/json",
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
