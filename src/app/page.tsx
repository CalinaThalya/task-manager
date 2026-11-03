
import TasksClient from "./tasks-client";
import {
  HydrateClient,
  getQueryClient,
  trpc,
} from "@/trpc/server";

export default async function Home() {
  await getQueryClient().prefetchQuery(
    trpc.task.list.queryOptions(),
  );

  return (
    <HydrateClient>
      <TasksClient />
    </HydrateClient>
  );
}
