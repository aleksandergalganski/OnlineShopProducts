// Selectors
const cartItems = document.getElementById('cart-items');
const cartItemsNum = document.getElementById('cart-items-num');
const totalPriceEl = document.getElementById('total-price');

const localStorageCart = JSON.parse(localStorage.getItem('cart'));
let cart = localStorageCart !== null ? localStorageCart : [];


// Functions
function addCartItemsToDOM() {
    if(cart.length == 0) {
        cartItems.innerHTML = '<p>Your shopping cart is empty</p>'
    } else {
        cartItems.innerHTML = cart.map( cartItem => {
            return `
            <div class="product">
                <img src="${cartItem.image}" alt="${cartItem.name}">
                <div class="product-name">
                    <h5>${cartItem.name}</h5>
                    <h6>${cartItem.manufacturer.name}</h6>
                </div>
                <h5>$${cartItem.price}</h5>
                <input type="number" id="${cartItem.id}-quantity" name="quantity" min="1" max="100" value="${cartItem.cartQuantity}"
                 onchange="sumCartItemPrice(${cartItem.id})">
                <h5 id="${cartItem.id}-price-sum">$${cartItem.price}</h5>
                <i class="far fa-trash-alt fa-2x" onclick="removeCartItem(${cartItem.id})"></i>
            </div> 
            `;
        }).join('');

        cart.forEach( cartItem => sumCartItemPrice(cartItem.id));
    }
    updateCartUINum();
    calcTotalPrice();
}

function removeCartItem(productId) {
    cart = cart.filter(product => product.id !== productId);
    updateLocalStorage();
    updateCartUINum();
    addCartItemsToDOM();
    calcTotalPrice();
}

function sumCartItemPrice(productId) {
    let { price, cartQuantity } = cart.filter(product => product.id === productId)[0];
    price = Number.parseInt(price);
    cartQuantity = Number.parseInt(cartQuantity);
    const inputQuantity = Number.parseInt(document.getElementById(`${productId}-quantity`).value);

    if(cartQuantity !== inputQuantity) {
        cart.forEach( cartItem => {
            if(cartItem.id === productId) {
                cartItem['cartQuantity'] = inputQuantity;
            }
        });
    }

    document.getElementById(`${productId}-price-sum`).innerText = `$${price * inputQuantity}`;
    
    updateLocalStorage();
    calcTotalPrice();    
}

function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUINum() {
    cartItemsNum.innerText = cart.length;
}

function calcTotalPrice() {
    if(cart.length === 0) {
        totalPriceEl.innerText = '$0';
    } else {
        const amounts = cart.map( cartItem => Number.parseInt(cartItem.price) * Number.parseInt(cartItem.cartQuantity));
        const totalPrice = amounts.reduce((acc, amount) => acc + amount);
        totalPriceEl.innerText = `$${totalPrice}`;
    }
}

window.onload = addCartItemsToDOM();
