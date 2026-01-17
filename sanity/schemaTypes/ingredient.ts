import {defineType} from 'sanity'

export const ingredient = defineType({
  name: 'ingredient',
  title: 'Ingredient',
  type: 'object',
  fields: [
    {
      name: 'amount',
      title: 'Amount',
      type: 'string',
    },
    {
      name: 'unit',
      title: 'Unit',
      type: 'string',
    },
    {
      name: 'name',
      title: 'Ingredient',
      type: 'string',
      validation: (rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      amount: 'amount',
      unit: 'unit',
      name: 'name',
    },
    prepare({amount, unit, name}) {
      const parts = [amount, unit, name].filter(Boolean)
      return {
        title: parts.join(' '),
      }
    },
  },
})
