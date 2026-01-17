import {defineType} from 'sanity'

export const ingredientGroup = defineType({
  name: 'ingredientGroup',
  title: 'Ingredient Group',
  type: 'object',
  fields: [
    {
      name: 'groupName',
      title: 'Group Name',
      type: 'string',
      description: 'Optional group name (e.g., "For the sauce", "For the dough")',
    },
    {
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [{type: 'ingredient'}],
      validation: (rule) => rule.required().min(1),
    },
  ],
  preview: {
    select: {
      groupName: 'groupName',
      ingredients: 'ingredients',
    },
    prepare({groupName, ingredients}) {
      const count = ingredients?.length ?? 0
      return {
        title: groupName || 'Ingredients',
        subtitle: `${count} ingredient${count === 1 ? '' : 's'}`,
      }
    },
  },
})
