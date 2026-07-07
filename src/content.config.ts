import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const cv = defineCollection({
  loader: file('src/content/cv/entries.yaml'),
  schema: z.object({
    meta: z.object({
      title: z.string(),
      description: z.string(),
      role: z.string().optional(),
      email: z.email().optional(),
      website: z.url().optional(),
      portfolio: z.url().optional(),
      linkedin: z.url().optional(),
    }),
    skills: z.array(
      z.object({
        category: z.string(),
        content: z.string(),
      })
    ),
    languages: z.array(
      z.object({
        name: z.string(),
        level: z.string(),
      })
    ),
    experience: z.array(
      z.object({
        company: z.string(),
        position: z.string(),
        begin: z.string(),
        end: z.string().nullable().optional(),
        weight: z.number(),
        description: z.string(),
      })
    ),
  }),
});

export const collections = {
  cv,
};
