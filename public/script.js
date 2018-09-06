var PRICE = 9.99;
var LOAD_NUM = 10;

var pusher = new Pusher('eaf6d2effa2f1aa8e94b', {
    cluster: 'ap1',
    encrypted: true
})


new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        newSearch: '90s',
        lastSearch: '',
        loading: false,
        errorMsg: false,
        price: PRICE,

    },
    computed: {
        noMoreItems() {
            return this.items.length === this.results.length && this.results.length > 0
        }
    },
    watch: {
        cart: {
            handler(val, ){
                this.$http.post('/cart_update', val)
            },
            deep: true
        }
    },
    methods: {
        appendItems() {
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append)
            }
        },
        onSubmit() {
            if (this.newSearch.length) {
                this.items = [];
                this.loading = true;
                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(function (res) {
                        this.results = res.data;
                        this.appendItems();
                        this.loading = false;
                        this.lastSearch = this.newSearch;
                    })
                    .catch(function (err) {
                        this.errorMsg = true
                    })
            }

        },
        addItem(index) {
            this.total += PRICE;
            // this.cart.push(this.items[index])
            var item = this.items[index];
            var found = false;
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id == item.id) {
                    found = true
                    this.cart[i].qty++;
                    break;
                }
            }

            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                })
            }

        },
        inc(item) {
            item.qty++;
            this.total += PRICE;
        },
        dec(item) {
            item.qty--;
            this.total -= PRICE;
            if (item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1)
                        break;
                    }
                }
            }
        }
    },
    filters: {
        currency: function (price) {
            return '$'.concat(price.toFixed(2))
        }
    },
    mounted() {
        this.onSubmit();
        var vueInstance = this;
        var elem = document.getElementById('product-list-bottom')
        var watcher = scrollMonitor.create(elem)
        watcher.enterViewport(function () {
            vueInstance.appendItems();
        })
        var channel = pusher.subscribe('cart')
        channel.bind('update', function(data){
            console.log(data)
        })
    },
})

