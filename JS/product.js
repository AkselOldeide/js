document.addEventListener("DOMContentLoaded", () => {
    const productId = new URLSearchParams(window.location.search).get('id');
    const endpoint = `https://v2.api.noroff.dev/square-eyes/${productId}`;
    const productContainer = document.getElementById('movie-details');
    const cartButton = document.getElementById('cart-button');
    const cartCountElement = document.getElementById('cart-count');
    const cartToggleButton = document.getElementById('cart-toggle-button');
    const cartDropdown = document.getElementById('cart-items-dropdown');

    if (!productContainer) {
        console.error('Product details container not found.');
        return;
    }

    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const product = data.data;
            displayProduct(product);
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });

    function displayProduct(product) {
        productContainer.innerHTML = `
            <h1>${product.title}</h1>
            <img src="${product.image.url}" alt="${product.image.alt}">
            <p>${product.description}</p>
            <p>Genre: ${product.genre}</p>
            <p>Rating: ${product.rating}</p>
            <p>Released: ${product.released}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
        `;

        updateCartButton(product.id);

        cartButton.addEventListener('click', () => {
            const cartItem = {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image.url
            };

            if (isInCart(product.id)) {
                removeFromCart(product.id);
            } else {
                addToCart(cartItem);
            }
            updateCartButton(product.id);
        });
    }

    function isInCart(itemId) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        return cartItems.some(item => item.id === itemId);
    }

    function addToCart(item) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.push(item);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartInfo();
        displayCartItems();
    }

    function removeFromCart(itemId) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartInfo();
        displayCartItems();
    }

    function updateCartButton(itemId) {
        const buttonText = isInCart(itemId) ? 'Remove from Cart' : 'Add to Cart';
        cartButton.textContent = buttonText;
    }

    function updateCartInfo() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartCountElement.textContent = cartItems.length;
    }

    function displayCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartItemsList = document.getElementById('cart-items-list');

        cartItemsList.innerHTML = '';

        if (cartItems.length === 0) {
            cartItemsList.innerHTML = "<p>No items in cart</p>";
            return;
        }

        cartItems.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('cart-item-card');

            card.onclick = () => {
                window.location.href = `product.html?id=${item.id}`;
            };

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('cart-item-info');

            const title = document.createElement('h4');
            title.textContent = item.title;

            const price = document.createElement('p');
            price.textContent = `$${item.price}`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'x';
            removeButton.classList.add('remove-item-button');
            removeButton.onclick = (e) => {
                e.stopPropagation();
                removeCartItem(item.id);
            };

            infoDiv.appendChild(title);
            infoDiv.appendChild(price);
            card.appendChild(img);
            card.appendChild(infoDiv);
            card.appendChild(removeButton);
            cartItemsList.appendChild(card);
        });

        if (cartItems.length > 0) {
            const checkoutButton = document.createElement('button');
            checkoutButton.textContent = 'Checkout';
            checkoutButton.classList.add('checkout-button');
            checkoutButton.onclick = () => {
                window.location.href = 'checkout.html';
            };

            cartItemsList.appendChild(checkoutButton);
        }
    }

    function removeCartItem(itemId) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCartItems();
        updateCartInfo();

        updateCartButton(productId);
    }

    cartToggleButton.addEventListener('click', () => {
        cartDropdown.classList.toggle('hidden');
    });

    window.addEventListener('storage', (event) => {
        if (event.key === 'cartItems') {
            updateCartButton(productId);
            updateCartInfo();
            displayCartItems();
        }
    });

    updateCartInfo();
    displayCartItems();
});
