document.addEventListener("DOMContentLoaded", function () {
    // === CART FUNCTIONALITY ===
    const cartIcon = document.querySelector("#cart-icon");
    const cart = document.querySelector(".cart");
    const cartClose = document.querySelector("#cart-close");

    cartIcon.addEventListener("click", () => cart.classList.add("active"));
    cartClose.addEventListener("click", () => cart.classList.remove("active"));

    const container = document.querySelector(".cart-content");
    container.innerHTML = ''; // Start with an empty cart

    const addCartButtons = document.querySelectorAll(".add-cart");
    addCartButtons.forEach(button => {
        button.addEventListener("click", event => {
            const productBox = event.target.closest(".product-box");
            addToCart(productBox);
            saveCartToLocalStorage();
        });
    });

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
        itemCountElement.textContent = cartBoxes.length;

        itemCountElement.style.visibility = cartBoxes.length > 0 ? "visible" : "hidden";

        document.querySelector(".total-price").textContent = `$${total.toFixed(2)}`;
        saveCartToLocalStorage();
    };

    const addToCart = (productBox) => {
        const productImgSrc = productBox.querySelector("img").src;
        const productTitle = productBox.querySelector(".product-title").textContent;
        const productLocation = productBox.querySelector(".product-location")?.textContent || "";
        const productPrice = productBox.querySelector(".price").textContent;

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
                <h3 class="cart-location">${productLocation}</h3>
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
            const productPrice = cartBox.querySelector(".cart-price").textContent;
            const productLocation = cartBox.querySelector(".cart-location")?.textContent || "";
            const quantity = parseInt(cartBox.querySelector(".number").textContent);
            const productImgSrc = cartBox.querySelector(".cart-img").src;
            cartData.push({ productTitle, productLocation, productPrice, quantity, productImgSrc });
        });
        localStorage.setItem("cartData", JSON.stringify(cartData));
    };

    // === SEARCH FUNCTIONALITY WITH SCROLL ===
    const searchForm = document.getElementById("product-search-form");
    const searchInput = document.getElementById("search-input");
    const productBoxes = document.querySelectorAll(".product-box");

    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const query = searchInput.value.toLowerCase().trim();
        let found = false;

        productBoxes.forEach(box => {
            const title = box.querySelector(".product-title").textContent.toLowerCase();
            if (title.includes(query)) {
                box.style.display = "block";
                found = true;
            } else {
                box.style.display = "none";
            }
        });

        // Scroll to first visible product
        if (found) {
            for (let box of productBoxes) {
                if (getComputedStyle(box).display !== "none") {
                    box.scrollIntoView({ behavior: "smooth" });
                    break;
                }
            }
        }

        // Show all if query is empty
        if (query === "") {
            productBoxes.forEach(box => box.style.display = "block");
        }
    });
});


const cartButton = document.getElementById('.add-cart');
const tiles = document.querySelectorAll('.shelf');

cartButton.addEventListener('click', () => {
tiles.forEach(tile => {
    tile.classList.toggle('active');
});
});
