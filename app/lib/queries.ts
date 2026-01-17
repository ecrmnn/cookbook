import { sanityClient } from "./sanity";
import type { Recipe, RecipeListItem } from "~/types/recipe";

const recipeListFields = `
  _id,
  title,
  description,
  "imageUrl": image.asset->url,
  prepTime,
  portions
`;

const recipeDetailFields = `
  _id,
  title,
  description,
  "imageUrl": image.asset->url,
  prepTime,
  portions,
  ingredientGroups[] {
    groupName,
    ingredients[] {
      amount,
      unit,
      name
    }
  },
  steps
`;

export async function getAllRecipes(): Promise<RecipeListItem[]> {
  const query = `*[_type == "recipe"] | order(_createdAt desc) {
    ${recipeListFields}
  }`;
  return sanityClient.fetch(query);
}

export async function searchRecipes(searchTerm: string): Promise<RecipeListItem[]> {
  const query = `*[_type == "recipe" && (
    title match $searchTerm ||
    description match $searchTerm
  )] | order(_createdAt desc) {
    ${recipeListFields}
  }`;
  return sanityClient.fetch(query, { searchTerm: `*${searchTerm}*` });
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const query = `*[_type == "recipe" && _id == $id][0] {
    ${recipeDetailFields}
  }`;
  return sanityClient.fetch(query, { id });
}
