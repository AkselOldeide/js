document.addEventListener("DOMContentLoaded", () => {
    const cartToggleButton = document.getElementById('cart-toggle-button');
    const cartDropdown = document.getElementById('cart-items-dropdown');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutItemsList = document.getElementById('checkout-items-list');
    const checkoutButton = document.getElementById('checkout-button');
    let totalPriceElement = document.getElementById('total-price');

    
    function displayCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        
        cartItemsList.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartItemsList.innerHTML = "<p>No items in cart</p>";
        } else {
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
        }
    }

    function removeCartItem(itemId) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCartItems(); 
        updateCartCount(); 
        updateCheckoutItems(); 
    }
    
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartCountElement.textContent = cartItems.length;
    }

    function updateCheckoutItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        checkoutItemsList.innerHTML = '';
        let totalPrice = 0;

        cartItems.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('checkout-item-card');

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('checkout-item-info');

            const title = document.createElement('h4');
            title.textContent = item.title;

            const price = document.createElement('p');
            price.textContent = `$${item.price}`;

            
            infoDiv.appendChild(title);
            infoDiv.appendChild(price);
            card.appendChild(img);
            card.appendChild(infoDiv);
            checkoutItemsList.appendChild(card);

            totalPrice += item.price;
        });

        totalPriceElement.textContent = totalPrice.toFixed(2);

        
        if (cartItems.length > 0) {
            checkoutButton.classList.remove('hidden');
        } else {
            checkoutButton.classList.add('hidden');
        }
    }

    
    cartToggleButton.addEventListener('click', () => {
        cartDropdown.classList.toggle('hidden');
    });
    
    
    updateCartCount();
    displayCartItems();
    updateCheckoutItems();
});
