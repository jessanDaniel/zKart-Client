import Ember from 'ember';

export default Ember.Route.extend({
    productService : Ember.inject.service("product-service"),
    userSessionService : Ember.inject.service('user-session-service'),

    queryParams : {
        page : {
            refreshModel : true
        },
        perPage : {
            refreshModel : true 
        },
        searchQuery : {
            refreshModel : true 
        },
        filterBy : {
            refreshModel : true 
        }
    },

    model(params) {
        // return this.get('productService').fetchProducts();
        return Ember.RSVP.hash({
            products : this.get('productService').fetchProducts(params.page, params.perPage, params.filterBy, params.searchQuery),
            userInfo : this.get('userSessionService').fetchUserInfo()
        })
    },

    setupController(controller, model) {
        this._super(controller, model),
        controller.set('products', model.products),
        controller.set('disableNext', model.products.disableNext)
    },

    actions : {
        refreshModel() {
            this.refresh();
        }
    }
});
