import Ember from 'ember';
export default Ember.Controller.extend({

  // userSession : Ember.inject.service('user-session-service'),
  router : Ember.inject.service("-routing"),
  
  applicationController : Ember.inject.controller('application'),
  userInfo : null,
  queryParams : ['page', 'perPage', 'searchQuery', 'filterBy'],
  page:1,
  perPage : 8,
  searchQuery : "",
  filterBy : "",
  products : null,
  disableNext : true,
  disablePrev : Ember.computed(function(){
    return this.get('page') === 1;
  }),
  productsView : true,

  

  //dropdown obj
  categories : [
    {
      value:"laptop",
      viewValue : "Laptop"
    },
    {
      value:"mobile",
      viewValue : "Mobile"
    },{
      value:"tablet",
      viewValue : "Tablet"
    },{
      value:"",
      viewValue : "None"
    }
  ],

    init() {
        this._super(...arguments);
        
        // Ember.run.later(this, function() {
        //   window.scrollBy({
        //     top: window.innerHeight,
        //     left: 0,
        //     behavior: 'smooth'
        //   });
        // }, 3000); 

        this.get("applicationController").fetchUserInfo().then(response => this.set('userInfo', response)).catch(err => console.log(err));
    },

    actions : {
      setUserNull() {
        this.set('userInfo', null);
      },

      routeToCart(){
        this.transitionToRoute("cart", this.get('userInfo.user_id'));
      },
      
      routeToOrder() {
        console.log("inside route to order");
        this.transitionToRoute("order",this.get('userInfo.user_id'))
      },

      updateSearchQuery(event) {
        this.set('searchQuery', event)
      },

      updateFilterBy(category) {
        this.set('filterBy', category || "");  
      if (category) {
        this.set('filterBy', category);
      } else {
        this.set('filterBy', "");
      }
      },

      nextPage() {
        if (!this.get('disableNext')) {
          this.incrementProperty('page');
        }
      },
  
      previousPage() {
        if (this.get('page') > 1) {
          this.decrementProperty('page');
        }
      },

      showProductDetails(productId){
        this.set('productsView', false);
        this.transitionToRoute("landing.details", productId);
      }

    }

    // loadUserInfo() {
    //   const appController = this.get('applicationController');

    //   if(!appController.get('userInfo')) {
    //     appController.fetchUserInfo().then(response=>{
    //       this.set('userInfo', response);
    //     }).catch(err => console.log(err));
    //   } else {
    //     this.set('userInfo', appController.get('userInfo'))
    //   }
    // }

});
