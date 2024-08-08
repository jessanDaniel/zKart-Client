import Ember from 'ember';
// import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import $ from "jquery";

export default Ember.Controller.extend({
    ajax: service(),
    routing: Ember.inject.service("-routing"),
    productService : Ember.inject.service("product-service"),

    queryParams : ['page', 'perPage', 'searchQuery', 'filterBy'],
    page : 1,
    perPage : 8,
    searchQuery : "",
    filterBy : "",
    products : null,
    disableNext : true,
    disablePrev : Ember.computed(function(){
        return this.get('page') === 1;
    }),

    isAdd: true,
    isUpdate: false,
    isDelete: false,
    activeCard : 'add',

    categories: [],
    brands: {},

    selectedCategory: 'laptop',
    selectedBrand: 'Apple',
    productModel: '',
    price: '',
    quantity: 0,            
    description: '',
    image: null,

    init() {
        this._super(...arguments);
        this.loadCategoriesAndBrands();
    },

    loadCategoriesAndBrands() {
        this.get('ajax').request('/client/assets/categories-brands-dropdown.json')
            .then((data) => {
                this.set('categories', data.categories);
                this.set('brands', data.brands);
                // this.set('filteredBrands', this.get('brands')[this.get('selectedBrand')]);
            })
    },

    filteredBrands: Ember.computed('selectedCategory', 'brands', function () {
        return this.get('brands')[this.get('selectedCategory')] || [];
    }),

    actions: {
        showAddForm() {
            this.set('activeCard', 'add');
            this.set('isAdd', true);
            this.set('isUpdate', false);

        },

        showUpdate() {
            this.set('activeCard', 'update');
            this.set('isAdd', false);
            this.set('isUpdate', true);
            // this.get('productService').fetchProducts(this.get('page'), this.get('perPage'), this.get('filterBy'), this.get('searchQuery'));
        },

        submitForm() {

            let formData = new FormData();
            formData.append('productBrand',this.get('selectedBrand'));
            // console.log("selectedBrand", this.get('selectedBrand'));
            formData.append('category', this.get('selectedCategory'));
            formData.append('productModel', this.get('productModel'));
            formData.append('price', this.get('price'));
            formData.append('stock', this.get('quantity'));
            formData.append('description', this.get('description'));
            //createdAt and updatedAt logic

            // if(this.get('image')) {
            //     formData.append('image', this.get('image'));
            // }
            // for(let [key,value] of formData.entries()) {
            //     console.log(key, value);
            // } 

            let fileInput = document.querySelector('input[type="file"');
            let file = fileInput ? fileInput.files[0] : null;
            if(file) {
                formData.append('image', file);
            }

            $.ajax({
                url:'http://localhost:8082/zKart/api/v1/product',
                method:'POST',
                data : formData,
                contentType:false,
                processData:false,
                xhrFields: {
                    withCredentials:true
                }, 
                success : (response) => {
                    console.log(response, "response from servlet");
                    // this.showUpdate();
                    Ember.run(()=> {
                        setTimeout(()=> {
                            this.get('productService').fetchProducts(this.get('page'), this.get('perPage'), this.get('filterBy'), this.get('searchQuery')).then(res => {
                                console.log(res);
                                this.send('refreshModel');
                                this.send('showUpdate');
                            });
                        },10)
                    })
                },
                error:(error)=> {
                    console.log(error, "error in servlet");
                }
            })

        },

        increaseStock(product) {
            console.log("inside here", product);
            let productQuantity = product.stock;
            Ember.set(product, 'stock', productQuantity + 1)
            console.log(product.stock, "quantity");
            this.get('productService').updateProductStock(product).then(response => {
                console.log("Stock increased successfully", response);
            }).catch(error=>{
                console.log("error in updating quantity", error);
                Ember.set(product, 'stock', productQuantity)
            })
        },

        decreaseStock(product){
            console.log("i am here");
            if (product.stock > 0) {
                
                let productQuantity = product.stock;
                Ember.set(product, 'stock', productQuantity - 1);

                
                this.get('productService').updateProductStock(product)
                    .then(response => {
                        console.log('Stock decreased successfully:', response);
                    })
                    .catch(error => {
                        console.error('Error decreasing stock:', error);
                        
                        Ember.set(product,'stock', productQuantity);
                    });
            }
        },

        deleteProduct(product){
            console.log("inside delete");
            let products = this.get('productService.products').slice();
            this.get('productService.products').removeObject(product);

            this.get('productService').deleteProduct(product.productId).then(response => {
                console.log("product deleted", response);
            }).catch(error => {
                console.log(error, "error in deleting");
                this.set('productService.products',products);
            })
        },

        
        setUserNull() {
            this.set('userInfo', null);
        }
    }

});
