
export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
};

const tasks: Task[] = [];

export const taskStore = {
  list(): Task[] {
    return [...tasks];
  },

  create(data: {
    title: string;
    description?: string;
  }): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      createdAt: Date.now(),
    };

    tasks.push(task);

    return task;
  },

  update(
    id: string,
    data: {
      title?: string;
      description?: string;
    },
  ): Task {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
      throw new Error("Task not found.");
    }

    if (data.title !== undefined) {
      task.title = data.title;
    }

    if (data.description !== undefined) {
      task.description = data.description;
    }

    return task;
  },

  delete(id: string): Task {
    const index = tasks.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error("Task not found.");
    }

    const [deletedTask] = tasks.splice(index, 1);

    return deletedTask;
  },
};
