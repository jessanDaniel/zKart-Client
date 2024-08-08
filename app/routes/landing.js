import Ember from 'ember';

export default Ember.Route.extend({

    productService : Ember.inject.service("product-service"),
    userSessionService : Ember.inject.service('user-session-service'),
    loadingService : Ember.inject.service("loading"),
    
    queryParams : {
        page : {
            refreshModel : true
        },
        perPage : {
            refreshModel : true
        },
        searchQuery : {
            refreshModel: true 
        },
        filterBy : {
            refreshModel : true 
        }
    },
    
    beforeModel() {
        this.get("loadingService").show();
    },

    model(params) {
        // return this.get("productService").fetchProducts()
        
        return Ember.RSVP.hash({
            products : this.get('productService').fetchProducts(params.page, params.perPage, params.filterBy, params.searchQuery),
            userInfo : this.get('userSessionService').fetchUserInfo()
        })

    },


    afterModel() {
        this.get("loadingService").hide()
    },

    setupController(controller, model) {
        this._super(controller, model);
        controller.set('products', model.products.product_list.slice(0,8));
        controller.set('disableNext', model.products.disableNext);
        controller.set('userInfo', model.userInfo);
        // console.log(model.products,"...products");

    } 
    
    
});
