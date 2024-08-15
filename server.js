const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const SPOONACULAR_API_KEY = 'c3cb229d90b049b4b86831661e577abc'; // Replace with your actual API key

app.get('/api/recipe', async (req, res) => {
    try {
        const recipeName = req.query.name;
        console.log('Searching for recipe:', recipeName);
        
        // First, search for the recipe
        const searchResponse = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                query: recipeName,
                number: 1
            }
        });
        
        if (searchResponse.data.results && searchResponse.data.results.length > 0) {
            const recipeId = searchResponse.data.results[0].id;
            
            // Get detailed recipe information
            const recipeResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
                params: {
                    apiKey: SPOONACULAR_API_KEY
                }
            });
            
            const recipe = recipeResponse.data;
            
            // Search for side dishes
            const sideDishResponse = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
                params: {
                    apiKey: SPOONACULAR_API_KEY,
                    type: 'side dish',
                    number: 3
                }
            });
            
            const formattedRecipe = {
                name: recipe.title,
                ingredients: recipe.extendedIngredients.map(ing => ing.original),
                sideDishes: sideDishResponse.data.results.map(dish => dish.title)
            };
            
            console.log('Formatted recipe:', formattedRecipe);
            res.json(formattedRecipe);
        } else {
            console.log('No results found for:', recipeName);
            res.status(404).json({ error: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error fetching recipe:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching recipe' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});