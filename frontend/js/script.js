// Selectors
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const brandSelect = document.getElementById('brand');
const categorySelect = document.getElementById('category');
const minPrice = document.getElementById('min');
const maxPrice = document.getElementById('max');
const querryForm = document.getElementById('form');
const button = document.getElementById('button');
const productsDOM = document.getElementById('products');
const cartItemsNum = document.getElementById('cart-items-num');
const cartIcon = document.getElementById('cart-icon');

const localStorageCart = JSON.parse(localStorage.getItem('cart'));

let cart = localStorageCart !== null ? localStorageCart : [];


// Functions
function getInputs(event) {
    event.preventDefault();
    const sortQuery = getSortQuery(sortSelect.options[sortSelect.selectedIndex].value);
    const brandQuery = getBrandQuery(brandSelect.options[brandSelect.selectedIndex].value);
    const categoryQuery = getCategoryQuery(categorySelect.options[categorySelect.selectedIndex].value);
    const priceQuery = getPriceQuery(minPrice.value, maxPrice.value);
    getProducts(sortQuery, brandQuery, categoryQuery, priceQuery);
}

function searchProducts(event) {
    event.preventDefault();
    const searchValue = searchInput.value;
    fetch(`http://localhost:8000/api/v1/products/?search=${searchValue}`)
        .then(res => res.json())
        .then(data => {
            addProductsToDOM(data);
        });
}


function getSortQuery(sortInput) {
    switch(sortInput) {
        case '': return '';
        case 'created-asc': return 'ordering=created';
        case 'price-asc': return 'ordering=price';
        case 'price-desc': return 'ordering=-price';
        case 'name-asc': return 'ordering=name';
        case 'name-desc': return 'ordering=-name';
    }
}

function getBrandQuery(brandInput) {
    return brandInput !== '0' ? `manufacturer=${brandInput}` : '';
}

function getCategoryQuery(categoryInput) {
    return categoryInput !== '0' ? `category=${categoryInput}` : '';
}

function getPriceQuery(minInput, maxInput) {
    if(minInput === '' && maxInput === '') {
        return '';
    } else if (minInput !== '' && maxInput === '') {
        return `price__gte=${minInput}`;
    } else if (minInput === '' && maxInput !== '') {
        return `price__lte=${maxInput}`;
    } else {
        return `price__gte=${minInput}&price__lte=${maxInput}`;
    }
}

function getProducts(sortQuery, brandQuery, categoryQuery, priceQuery) {
    let queryParams = [sortQuery, brandQuery, categoryQuery, priceQuery];
    queryParams = queryParams.filter( queryParam => queryParam !== '');
    if(queryParams.length > 0) {
        queryParams[0] = `?${queryParams[0]}`;
        queryParams.push('/');
    }
    const url = `http://localhost:8000/api/v1/products/${queryParams.length == 1 ? queryParams.join('') : queryParams.join('&')}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            addProductsToDOM(data);
        });
}

function getAllProducts() {
    fetch('http://localhost:8000/api/v1/products/')
        .then(res => res.json())
        .then(data => {
            addProductsToDOM(data);
        });
}


function addProductsToDOM(products) {
    if(products.results.length == 0) {
        productsDOM.innerHTML = '<p>Sorry, no results for this search criteria</p>';
    } else {
        productsDOM.innerHTML= products.results.map( product => {
            return `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <h5>${product.name}</h5>
                    <h6>${product.manufacturer.name}</h6>
                    <span id="price">$${product.price}</span>
                    <button onClick="addProductToCart(${product.id})">Add to Cart</button>
                </div>
            `
        }).join('');
    }
}

function addCategoriesToDOM() {
    fetch('http://127.0.0.1:8000/api/v1/categories/')
        .then(res => res.json())
        .then(data => {
            options = data.map( category => {
                return `
                    <option value="${category.id}">${category.name}</option>
                `
            });
            options.unshift('<option value="0">Category</option>')
            categorySelect.innerHTML = options.join();
        });
}

function addBrandsToDOM() {
    fetch('http://127.0.0.1:8000/api/v1/manufacturers/')
        .then(res => res.json())
        .then(data => {
            options = data.map( brand => {
                return `
                    <option value="${brand.id}">${brand.name}</option>
                `
            });
            options.unshift('<option value="0">Brand</option>')
            brandSelect.innerHTML = options.join('');
        });
}

function addProductToCart(productId) {
    cartIcon.classList.remove('cart-animation-class');
    const duplicates = cart.filter( product => product.id === productId);
    if(duplicates.length === 0) {
        fetch(`http://localhost:8000/api/v1/products/${productId}/`)
        .then(res => res.json())
        .then(data => {
            cart.push(data);
            updateLocalStorage();
            updateCartUINum();
            cartIcon.classList.add('cart-animation-class');
        });
    }

}

function updateLocalStorage() {
    cart.forEach( cartItem => cartItem['cartQuantity'] = 1);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUINum() {
    cartItemsNum.innerText = cart.length;
}


function getInitialData() {
    getAllProducts();
    addCategoriesToDOM();
    addBrandsToDOM();
    updateCartUINum();
}


// Event Listeners
window.onload = getInitialData();
querryForm.addEventListener('submit', getInputs);
searchForm.addEventListener('submit', searchProducts);