import Ember from 'ember';
import $ from "jquery";
import config from "z-kart/config/environment";


export default Ember.Service.extend({
    products: null,
    lastFetchTime: null,
    cacheDuration: 60000 * 5,

    init() {
        this._super(...arguments);
        this.set('products', []);
        // this.fetchProductsIfNeeded();
    },

    fetchProductsIfNeeded() {
        let now = Date.now();
        let lastFetchTime = this.get('lastFetchTime');

        if (!lastFetchTime || (now - lastFetchTime) > this.get('cacheDuration')) {
            this.fetchProducts();
        }
    },

    fetchProducts(page, perPage, filterBy, searchQuery) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            $.ajax({
                // url: 'http://localhost:8082/zKart/api/v1/product',
                url: `${config.API_URL}/product?page=${page}&perPage=${perPage}&filterBy=${filterBy}&searchQuery=${searchQuery}`,
                method: 'GET',
                contentType: "application/json",
                xhrFields: {
                    withCredentials: true
                },
                success: (response) => {
                    console.log("Successfully retrieved the products", response);
                    let metaObj = {};
                    if ((response.meta.subTotal % response.meta.perPage) === 1 && (Math.floor(response.meta.subTotal / response.meta.perPage)) !== 0) {
                        metaObj.disableNext = false;
                    } else {
                        metaObj.disableNext = true;
                    }

                    if (response.meta.page === 1 && (filterBy === "") && (searchQuery === "")) {
                        response.product_list.map((product, index) => {
                            if (index === 0) {
                                product.discount = true;
                                let discountPrice = product.price - (product.price * 20 / 100);
                                product.price = discountPrice;
                            } else {
                                product.discount = false;
                            }
                        })
                    }

                    const productsWithMeta = Object.assign({}, response, metaObj);
                    // const productsWithBase64Images = response.map(product => {
                    //     return Object.assign({}, product, {
                    //         imageBase64: product.image
                    //     });
                    // });
                    this.set('products', productsWithMeta.product_list);
                    resolve(productsWithMeta);
                },
                error: (error) => {
                    console.error("Error in retrieving product", error);
                    reject(error);
                }
            });
        })

    },

    updateProductStock(product) {
        return $.ajax({
            // url: `http://localhost:8082/zKart/api/v1/product/${product.productId}`,
            url: `${config.API_URL}/product/${product.productId}`,
            method: 'PUT',
            data: this.convertToFormData(product),
            contentType: false,
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            success: (response) => {
                console.log("successfully updated the product");
                return response;
            },
            error: (error) => {
                console.log(error, "error in updating product");
                return error
            }
        });
    },

    deleteProduct(productId) {
        return $.ajax({
            // url: `http://localhost:8082/zKart/api/v1/product/${productId}`,
            url: `${config.API_URL}/product/${productId}`,
            method: 'DELETE',
            xhrFields: {
                withCredentials: true
            },
            success: (response) => {
                console.log("successfully deleted the products");
                return response;
            },
            error: (error) => {
                console(error, "error in deleting product");
                return error
            }
        });
    },

    fetchProductDetails(productId) {
        return $.ajax({
            url: `${config.API_URL}/product/${productId}`,
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
            success: (response) => {
                return response.product;
            },
            error: (error) => {
                console.log(error);
                return error;
            }
        })
    },

    byteArrayToBase64() {
        // return new Ember.RSVP.Promise((resolve, reject) => {
        //     const blob = new Blob([new Uint8Array(byteArray)]);
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         const base64String = reader.result.split(',')[1];
        //         resolve(base64String);
        //     };
        //     reader.onerror = () => {
        //         reject(new Error('Error reading the byte array'));
        //     };
        //     reader.readAsDataURL(blob);
        // });


        // return new Promise((resolve, reject) => {
        //     const blob = new Blob([new Uint8Array(byteArray)]);
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         const base64String = reader.result.split(',')[1];
        //         resolve(base64String);
        //     };
        //     reader.onerror = reject;
        //     reader.readAsDataURL(blob);
        // });

        //     var binary = '';
        // var bytes = new Uint8Array( buffer );
        // var len = bytes.byteLength;
        // for (var i = 0; i < len; i++) {
        //     binary += String.fromCharCode( bytes[ i ] );
        // }
        // return window.btoa( binary );
    },

    convertToFormData(obj) {
        const formData = new FormData();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                formData.append(key, obj[key]);
            }
        }
        return formData;
    }
});



// const productsWithBase64Images = response.map(product => {
//     let imageBase64 = '';

//     if (Array.isArray(product.image)) {
//         imageBase64 = `data:image/jpeg;base64,${this.byteArrayToBase64(product.image)}`;
//     } else if (typeof product.image === 'string') {
//         // If already in Base64 string format
//         imageBase64 = product.image.startsWith('data:image/jpeg;base64,')
//             ? product.image
//             : `data:image/jpeg;base64,${product.image}`;
//     } else {
//         console.warn('Unexpected image format:', product.image);
//     }

//     return Object.assign({}, product, {
//         imageBase64: imageBase64
//     });
// });
// resolve(productsWithBase64Images);