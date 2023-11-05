export const cart = JSON.parse(localStorage.getItem('cart')) || [{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2
}, {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1
}];

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
    let matchingItem = null;
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    });
    if (matchingItem) {
        matchingItem.quantity += quantity
    } else {
        cart.push({
            productId,
            quantity
        });
    }
    saveToStorage();
    showAddedToCartMessage(productId);
}
let addMessageTimeoutID = null;
function showAddedToCartMessage(productId) {
    let product = document.querySelector(`.js-added-to-cart-${productId}`);
    product.classList.add('is-added');

    setTimeout(() => {
       if (addMessageTimeoutID) {
           clearTimeout(addMessageTimeoutID);
       }
        addMessageTimeoutID = setTimeout(() => {
           product.classList.remove('is-added')
       }, 2000);
    });
    // if (timeoutId) {
    //     clearTimeout(timeoutId);
    //     timeoutId = setTimeout(() => {
    //         product.classList.remove('is-added');
    //     }, 2000);
    // }
    // else {
    //     timeoutId = setTimeout(() => {
    //         product.classList.remove('is-added');
    //     }, 2000);
    // }
}

export function removeFromCart(productId) {
    let matchingItemIndex = null;
    cart.forEach((cartItem, index) => {
        if (cartItem.productId === productId) {
            matchingItemIndex = index;
        }
    });
    if (matchingItemIndex !== null) {
        cart.splice(matchingItemIndex, 1);
    }

    saveToStorage();
}

export function calculateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
}