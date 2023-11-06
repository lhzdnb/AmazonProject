import {calculateCartQuantity} from "../../data/cart.js";

function renderCheckOutHeader() {
    const cartQuantity = calculateCartQuantity();
    document.querySelector('.js-checkout-header-middle-section').innerHTML = `
            Checkout (<a class="return-to-home-link js-return-to-home-link"
            href="amazon.html">${cartQuantity} items</a>)`;
}

export default renderCheckOutHeader;