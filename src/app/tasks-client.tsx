
"use client";

import { useState, type FormEvent } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export default function TasksClient() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [titleError, setTitleError] = useState("");

  const tasksQuery = useQuery(
    trpc.task.list.queryOptions(),
  );

  const refreshTasks = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.task.list.queryKey(),
    });
  };

  const createMutation = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: async () => {
        await refreshTasks();
        setFeedback("Task created successfully!");
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: async () => {
        await refreshTasks();
        setFeedback("Task updated successfully!");
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: async () => {
        await refreshTasks();
        setFeedback("Task deleted successfully!");
      },
    }),
  );

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  const mutationError =
    createMutation.error ??
    updateMutation.error ??
    deleteMutation.error;

  function resetForm() {
    setTitle("");
    setDescription("");
    setEditingId(null);
    setTitleError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setTitleError("Title is required.");
      setFeedback("");
      return;
    }

    setTitleError("");
    setFeedback("");

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: cleanTitle,
          description: description.trim(),
        });
      } else {
        await createMutation.mutateAsync({
          title: cleanTitle,
          ...(description.trim()
            ? { description: description.trim() }
            : {}),
        });
      }

      resetForm();
    } catch {
      // Errors are displayed in the interface.
    }
  }

  function handleEdit(task: {
    id: string;
    title: string;
    description?: string;
  }) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description ?? "");
    setFeedback("");
    setTitleError("");
  }

  async function handleDelete(id: string) {
    setFeedback("");

    try {
      await deleteMutation.mutateAsync({ id });
    } catch {
      // Errors are displayed in the interface.
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Personal Organization
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Task Manager
          </h1>

          <p className="mt-3 text-slate-600">
            Organize your activities and keep track of your tasks.
          </p>
        </header>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            {editingId ? "Edit Task" : "New Task"}
          </h2>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium"
              >
                Title *
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setTitleError("");
                }}
                placeholder="Enter task title"
                maxLength={120}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {titleError && (
                <p
                  role="alert"
                  className="mt-2 text-sm text-red-600"
                >
                  {titleError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add details (optional)"
                rows={3}
                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Task"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {mutationError && (
            <p
              role="alert"
              className="mt-4 text-sm text-red-600"
            >
              {mutationError.message}
            </p>
          )}

          {feedback && (
            <p
              role="status"
              aria-live="polite"
              className="mt-4 text-sm text-green-600"
            >
              {feedback}
            </p>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              My Tasks
            </h2>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {tasksQuery.data?.length ?? 0} tasks
            </span>
          </div>

          {tasksQuery.isPending && (
            <p className="py-8 text-center text-slate-500">
              Loading tasks...
            </p>
          )}

          {tasksQuery.isError && (
            <p
              role="alert"
              className="py-8 text-center text-red-600"
            >
              Error loading tasks: {tasksQuery.error.message}
            </p>
          )}

          {tasksQuery.data?.length === 0 && (
            <p className="py-8 text-center text-slate-500">
              No tasks yet. Why not create your first one?
            </p>
          )}

          <div className="space-y-4">
            {tasksQuery.data?.map((task) => (
              <article
                key={task.id}
                className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-200"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-600">
                        {task.description}
                      </p>
                    )}

                    <p className="mt-3 text-xs text-slate-400">
                      Created on:{" "}
                      {new Date(task.createdAt).toLocaleString("en-US")}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(task)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-8 text-center text-sm text-slate-400">
          Task Manager · Next.js · TypeScript · tRPC
        </footer>
      </div>
    </main>
  );
}
