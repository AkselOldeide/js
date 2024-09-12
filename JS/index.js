const endpoint = "https://v2.api.noroff.dev/square-eyes";
let chosenGenre = "";
let chosenYear = "";
let moviesData = [];
const genrefull = `genre=${chosenGenre}`;
const yearfull = `released=${chosenYear}`;
const movieContainer = document.getElementById("movies-by-custom-sorting");
const parameterSelect = document.getElementById("parameter");
const valueSelect = document.getElementById("value");
const applyFilterBtn = document.getElementById("apply-filter");
fetch(endpoint)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    moviesData = data.data;
    populate(moviesData);
    populateFilterValues();
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
function populate(retrievedData) {
    movieContainer.innerHTML = "";
    retrievedData.forEach(movie => {
      const movieDiv = document.createElement("div");
      movieDiv.classList.add("movie-item");
      movieDiv.innerHTML = `
        <img src="${movie.image.url}" alt="${movie.image.alt}">
        <h3>${movie.title}</h3>
        <p>Released: ${movie.released}</p>
        <p>Price: $${movie.price}</p>
      `;
      movieDiv.onclick = () => {
        window.location.href = `product.html?id=${movie.id}`;
      };
      movieContainer.appendChild(movieDiv);
    });
}
function populateFilterValues() {
  const genres = [...new Set(moviesData.map(movie => movie.genre))];
  const years = [...new Set(moviesData.map(movie => movie.released))];
  valueSelect.innerHTML = "";
  parameterSelect.addEventListener('change', () => {
    valueSelect.innerHTML = "";
    if (parameterSelect.value === 'genre') {
      genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        valueSelect.appendChild(option);
      });
    } else if (parameterSelect.value === 'released') {
      years.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        valueSelect.appendChild(option);
      });
    }
  });
}
applyFilterBtn.addEventListener('click', () => {
  let filteredMovies = [...moviesData];
  const selectedFilter = parameterSelect.value;
  const selectedValue = valueSelect.value;
  if (selectedFilter === 'genre') {
    filteredMovies = moviesData.filter(movie => movie.genre === selectedValue);
  } else if (selectedFilter === 'released') {
    filteredMovies = moviesData.filter(movie => movie.released === selectedValue);
  }
  populate(filteredMovies);
});
document.addEventListener("DOMContentLoaded", () => {
    const cartToggleButton = document.getElementById('cart-toggle-button');
    const cartDropdown = document.getElementById('cart-items-dropdown');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartCountElement = document.getElementById('cart-count');
    cartToggleButton.addEventListener('click', () => {
      cartDropdown.classList.toggle('hidden');
    });
    function updateCartCount() {
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
        updateCartCount();
        const productId = new URLSearchParams(window.location.search).get('id');
        if (productId) {
          const cartButton = document.getElementById('cart-button');
          const isInCartNow = isInCart(productId);
          cartButton.textContent = isInCartNow ? 'Remove from Cart' : 'Add to Cart';
        }
      }
    displayCartItems();
    updateCartCount();
  });
