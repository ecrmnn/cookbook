export interface Ingredient {
  amount?: string;
  unit?: string;
  name: string;
}

export interface IngredientGroup {
  groupName?: string;
  ingredients: Ingredient[];
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface Recipe {
  _id: string;
  title: string;
  description?: string;
  image?: SanityImage;
  imageUrl?: string;
  prepTime?: number;
  portions?: number;
  ingredientGroups?: IngredientGroup[];
  steps?: string[];
}

export interface RecipeListItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  prepTime?: number;
  portions?: number;
}
