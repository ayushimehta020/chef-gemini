import React, { useRef } from "react";
import GeminiRecipe from "./GeminiRecipe";
import IngredientsList from "./IngredientsList";
import { getRecipeFromGemini } from "../ai";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([
    "all the main spices",
    "pasta",
    "ground beef",
    "tomato paste",
  ]);

  const [recipe, setRecipe] = React.useState(false);
  const recipeSection = useRef(null);

  React.useEffect(() => {
    if (recipe !== "" && recipeSection !== null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  async function getRecipe() {
    const recipeMarkdown = await getRecipeFromGemini(ingredients);
    setRecipe(recipeMarkdown);
  }

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient");
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
  }

  return (
    <main>
      <form action={addIngredient} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
        />
        <button>Add ingredient</button>
      </form>
      {ingredients.length > 0 ? (
        <IngredientsList
          ref={recipeSection}
          getRecipe={getRecipe}
          ingredients={ingredients}
        />
      ) : null}
      {recipe && <GeminiRecipe recipe={recipe} />}
    </main>
  );
}
