import {cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {products} from '../../data/products.js';
import formatCurrency from "../utils/money.js"; // default export
import {deliveryOptions, getDeliveryOption} from "../../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {renderPaymentSummary} from "./paymentSummary.js";
import renderCheckOutHeader from "./checkOutHeader.js";

export function renderOrderSummary() {
    document.addEventListener('DOMContentLoaded', renderCheckOutHeader);
    let cartSummaryHTML = '';
    cart.forEach((cartItem) => {
        const product = products.find((product) => {
            return product.id === cartItem.productId;
        });

        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${product.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
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
                ${deliveryOptionsHTML(cartItem)}
              </div>
            </div>
          </div>`;
    });
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    function deliveryOptionsHTML(cartItem) {
        let html = '';
        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');
            const priceString = deliveryOption.priceCents === 0 ? 'Free' : `$${formatCurrency(deliveryOption.priceCents)} - `;
            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
            html += `
        <div class="delivery-option js-delivery-option" data-product-id="${cartItem.productId}" data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${cartItem.productId}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>`
        });
        return html;
    }

    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            cart.forEach((cartItem, index) => {
                if (cartItem.productId === productId) {
                    removeFromCart(productId);
                    // document.querySelector(`.js-cart-item-container-${productId}`).remove();
                    renderOrderSummary();
                }
            });
            renderCheckOutHeader();
            renderPaymentSummary();
        });
    });



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
            renderCheckOutHeader();
        }
        else {
            alert('Quantity should in range of 0 to 1000!');
        }
    }
    document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productID = link.dataset.productId;
            update(productID);
            renderPaymentSummary();
        });
    });

    document.querySelectorAll('.js-quantity-input').forEach((input) => {
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const productID = input.dataset.productId;
                update(productID);
                renderPaymentSummary();
            }
        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const {productId, deliveryOptionId} = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}
