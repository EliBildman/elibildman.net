import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'document',
  fields: [
    defineField({
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description:
        'Enter the full URL (e.g., https://github.com/username or mailto:email@example.com)',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Optional icon name (e.g., "github", "linkedin", "email")',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order in which to display this link',
    }),
  ],
  preview: {
    select: {
      title: 'displayName',
      subtitle: 'url',
    },
  },
});
