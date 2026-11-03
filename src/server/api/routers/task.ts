
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { taskStore } from "@/server/data/tasks";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().optional(),
});

const updateTaskSchema = z
  .object({
    id: z.string().uuid("Invalid task ID."),
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty.")
      .optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined || data.description !== undefined,
    {
      message: "Provide at least one field to update.",
    },
  );

export const taskRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return taskStore.list();
  }),

  create: publicProcedure
    .input(createTaskSchema)
    .mutation(({ input }) => {
      return taskStore.create(input);
    }),

  update: publicProcedure
    .input(updateTaskSchema)
    .mutation(({ input }) => {
      try {
        return taskStore.update(input.id, {
          title: input.title,
          description: input.description,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Task not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Task not found.",
          });
        }

        throw error;
      }
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid task ID."),
      }),
    )
    .mutation(({ input }) => {
      try {
        return taskStore.delete(input.id);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Task not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Task not found.",
          });
        }

        throw error;
      }
    }),
});
