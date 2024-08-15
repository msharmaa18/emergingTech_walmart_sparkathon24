let cartCount = 0;

async function searchRecipe() {
    const searchTerm = document.getElementById('recipe-search').value;
    console.log('Searching for:', searchTerm);
    
    try {
        const response = await fetch(`/api/recipe?name=${searchTerm}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const recipe = await response.json();
        console.log('Recipe data:', recipe);
        
        if (recipe && !recipe.error) {
            displayRecipe(recipe);
        } else {
            console.log('Recipe not found');
            document.getElementById('recipe-details').innerHTML = 'Recipe not found';
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        document.getElementById('recipe-details').innerHTML = `Error fetching recipe: ${error.message}`;
    }
}

function displayRecipe(recipe) {
    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.innerHTML = `
        <h2>${recipe.name}</h2>
        <h3>Ingredients:</h3>
        <ul>
            ${recipe.ingredients.map(ingredient => `
                <li>
                    ${ingredient}
                    <button class="add-to-cart" onclick="addToCart('${ingredient}')">Add to Cart</button>
                </li>
            `).join('')}
        </ul>
        <h3>Suggested Side Dishes:</h3>
        <ul>
            ${recipe.sideDishes.map(dish => `
                <li>
                    ${dish}
                    <button class="add-to-cart" onclick="addToCart('${dish}')">Add to Cart</button>
                </li>
            `).join('')}
        </ul>
    `;
}

function addToCart(item) {
    const cartItems = document.getElementById('cart-items');
    const listItem = document.createElement('li');
    listItem.textContent = item;
    cartItems.appendChild(listItem);
    
    // Show "Item added to cart" message
    const message = document.createElement('div');
    message.textContent = 'Item added to cart';
    message.className = 'cart-message';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);  // Remove message after 2 seconds

    // Update cart count
    cartCount++;
    updateCartIcon();
}

function updateCartIcon() {
    const cartIcon = document.getElementById('cart-icon');
    cartIcon.textContent = cartCount;
    cartIcon.style.display = cartCount > 0 ? 'block' : 'none';
}

// Initialize cart icon
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
});