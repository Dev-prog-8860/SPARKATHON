const cart = document.querySelector(".cart");
const container = document.querySelector(".cart-content");
container.innerHTML = '';

const updateCartTotal = () => {
    const cartBoxes = document.querySelectorAll(".cart-box");
    let total = 0;
    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".number");
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        const quantity = parseInt(quantityElement.textContent);
        total += price * quantity;
    });
    const itemCountElement = document.querySelector(".cart-item-count");
    if (itemCountElement) {
        itemCountElement.textContent = cartBoxes.length;
        if (cartBoxes.length > 0) {
            itemCountElement.style.visibility = "visible";
        } else {
            itemCountElement.style.visibility = "hidden";
        }
    }
    const totalPriceElement = document.querySelector(".total-price");
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${total.toFixed(2)}`;
    }
    saveCartToLocalStorage();
};

const addToCart = productBox => {
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productLocationElement = productBox.querySelector(".product-location");
    if (!productLocationElement) {
        console.error("product-location element not found in productBox:", productBox);
    }
    const productLocation = productLocationElement ? productLocationElement.textContent : "undefined";
    const productPrice = productBox.querySelector(".price").textContent;

    console.log("Adding to cart:", { productTitle, productLocation, productPrice });

    const cartBoxes = document.querySelectorAll(".cart-box");
    for (let cartBox of cartBoxes) {
        const title = cartBox.querySelector(".cart-product-title").textContent;
        if (title === productTitle) {
            const quantityElement = cartBox.querySelector(".number");
            quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
            updateCartTotal();
            return;
        }
    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");

    cartBox.innerHTML = `
        <img src="${productImgSrc}" class="cart-img">
        <div class="cart-details">
            <h2 class="cart-product-title">${productTitle}</h2>
            <h3 class="product-location">${productLocation}</h3>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button class="decrement">-</button>
                <span class="number">1</span>
                <button class="increment">+</button>
            </div>
        </div>
        <i class="ri-delete-bin-6-line cart-remove"></i>
    `;

    const cartContent = document.querySelector(".cart-content");
    cartContent.appendChild(cartBox);

    updateCartTotal();

    const incrementBtn = cartBox.querySelector(".increment");
    const decrementBtn = cartBox.querySelector(".decrement");
    const removeBtn = cartBox.querySelector(".cart-remove");

    incrementBtn.addEventListener("click", () => {
        const quantityElement = cartBox.querySelector(".number");
        quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
        updateCartTotal();
    });

    decrementBtn.addEventListener("click", () => {
        const quantityElement = cartBox.querySelector(".number");
        let currentQuantity = parseInt(quantityElement.textContent);
        if (currentQuantity > 1) {
            quantityElement.textContent = currentQuantity - 1;
            updateCartTotal();
        }
    });

    removeBtn.addEventListener("click", () => {
        cartBox.remove();
        updateCartTotal();
    });
};

const saveCartToLocalStorage = () => {
    const cartBoxes = document.querySelectorAll(".cart-box");
    const cartData = [];
    cartBoxes.forEach(cartBox => {
        const productTitle = cartBox.querySelector(".cart-product-title").textContent;
        const productLocation = cartBox.querySelector(".product-location").textContent;
        const productPrice = cartBox.querySelector(".cart-price").textContent;
        const quantity = parseInt(cartBox.querySelector(".number").textContent);
        const productImgSrc = cartBox.querySelector(".cart-img").src;
        cartData.push({ productTitle, productLocation, productPrice, quantity, productImgSrc });
    });
    localStorage.setItem("cartData", JSON.stringify(cartData));
};

const loadCartFromLocalStorage = () => {
    const cartData = JSON.parse(localStorage.getItem("cartData"));
    if (!cartData) {
        print("Cart Empty");
        return;
    }
    cartData.forEach(item => {
        const cartBox = document.createElement("div");
        cartBox.classList.add("cart-box");
        cartBox.innerHTML = `
            <img src="${item.productImgSrc}" class="cart-img">
            <div class="cart-details">
                <h2 class="cart-product-title">${item.productTitle}</h2>
                <h3 class="product-location">${item.productLocation}</h3>
                <span class="cart-price">${item.productPrice}</span>
                <div class="cart-quantity">
                    <button class="decrement">-</button>
                    <span class="number">${item.quantity}</span>
                    <button class="increment">+</button>
                </div>
            </div>
            <i class="ri-delete-bin-6-line cart-remove"></i>
        `;
        const cartContent = document.querySelector(".cart-content");
        cartContent.appendChild(cartBox);

        const incrementBtn = cartBox.querySelector(".increment");
        const decrementBtn = cartBox.querySelector(".decrement");
        const removeBtn = cartBox.querySelector(".cart-remove");

        incrementBtn.addEventListener("click", () => {
            const quantityElement = cartBox.querySelector(".number");
            quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
            updateCartTotal();
        });

        decrementBtn.addEventListener("click", () => {
            const quantityElement = cartBox.querySelector(".number");
            let currentQuantity = parseInt(quantityElement.textContent);
            if (currentQuantity > 1) {
                quantityElement.textContent = currentQuantity - 1;
                updateCartTotal();
            }
        });

        removeBtn.addEventListener("click", () => {
            cartBox.remove();
            updateCartTotal();
        });
    });
    updateCartTotal();
};

loadCartFromLocalStorage();

// Add event listeners to add-cart icons to handle adding products to cart
const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
    button.addEventListener("click", () => {
        const productBox = button.closest(".product-box");
        if (productBox) {
            addToCart(productBox);
        }
    });
});
