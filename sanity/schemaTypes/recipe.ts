import {defineType} from 'sanity'

export const recipe = defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'prepTime',
      title: 'Prep Time (minutes)',
      type: 'number',
      validation: (rule) => rule.min(0).optional(),
    },
    {
      name: 'portions',
      title: 'Portions',
      type: 'number',
      validation: (rule) => rule.min(1),
    },
    {
      name: 'ingredientGroups',
      title: 'Ingredient Groups',
      type: 'array',
      of: [{type: 'ingredientGroup'}],
    },
    {
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [{type: 'text'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
})
