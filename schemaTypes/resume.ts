import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'resume',
  title: 'Resume',
  type: 'document',
  fields: [
    defineField({
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      lastUpdated: 'lastUpdated',
    },
    prepare(selection: any) {
      const { lastUpdated } = selection;
      return {
        title: lastUpdated ? `Resume - ${lastUpdated}` : 'Resume',
        subtitle: lastUpdated && `Updated: ${lastUpdated}`,
      };
    },
  },
});
