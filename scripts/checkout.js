import {cart, removeFromCart, calculateCartQuantity, updateQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from "./utils/money.js";

showCartSummary();
function showCartSummary() {
    let cartSummaryHTML = '';
    cart.forEach((cartItem) => {
        const product = products.find((product) => {
            return product.id === cartItem.productId;
        });
        cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${product.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${product.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${product.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(product.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${product.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input js-quantity-input-${product.id}" data-product-id="${product.id}">
                  <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${product.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${product.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${product.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${product.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${product.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
    });
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
}



document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        cart.forEach((cartItem, index) => {
            if (cartItem.productId === productId) {
                removeFromCart(productId);
                document.querySelector(`.js-cart-item-container-${productId}`).remove();
            }
        });
        updateCartQuantity();
    });
});

function updateCartQuantity() {
    let cartQuantity = calculateCartQuantity();
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
    document.querySelector('.js-payment-summary-quantity').innerHTML = `Items (${cartQuantity})`;
}

document.addEventListener('DOMContentLoaded', updateCartQuantity);

document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
    });
});

function update(productID) {
    const newQuantity = parseInt(document.querySelector(`.js-quantity-input-${productID}`).value);
    if (newQuantity >=0 && newQuantity < 1000) {
        document.querySelector(`.js-cart-item-container-${productID}`).classList.remove('is-editing-quantity');
        updateQuantity(productID, newQuantity);
        document.querySelector('.js-quantity-label').innerHTML = newQuantity.toString();
        updateCartQuantity();
    }
    else {
        alert('Quantity should in range of 0 to 1000!');
    }
}
document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productID = link.dataset.productId;
        update(productID);
    });
});

document.querySelectorAll('.js-quantity-input').forEach((input) => {
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const productID = input.dataset.productId;
            update(productID);
        }
    });
})