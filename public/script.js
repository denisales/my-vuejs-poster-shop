var PRICE = 9.99;
var LOAD_NUM = 10;



new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        errorMsg: false,
        price: PRICE

    },
    methods: {
        onSubmit(){
            this.items = [];
            this.loading = true;
            this.$http
                .get('/search/'.concat(this.newSearch))
                .then(function(res){
                    this.results = res.data;
                    this.items = res.data.slice(0, 10);
                    this.loading = false;
                    this.lastSearch = this.newSearch;
                    // this.newSearch = '';
                })
                .catch(function(err){
                    this.errorMsg = true
                })
        },
        addItem(index){
            this.total += PRICE;
            // this.cart.push(this.items[index])
            var item = this.items[index];
            var found = false;
            for(var i = 0; i < this.cart.length; i++){
                if(this.cart[i].id == item.id){
                    found = true
                    this.cart[i].qty++;
                    break;
                }
            }

            if(!found){
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                })
            }
         
        },
        inc(item){
            item.qty++;
            this.total += PRICE;
        },
        dec(item){
            item.qty--;
            this.total -= PRICE;
            if(item.qty <= 0){
                for(var i = 0; i < this.cart.length; i++){
                    if(this.cart[i].id === item.id){
                        this.cart.splice(i, 1)
                        break;
                    }
                }
            }
        }
    },
    filters: {
        currency: function(price){
            return '$'.concat(price.toFixed(2))
        }
    },
    mounted(){
        this.onSubmit();
    }
})