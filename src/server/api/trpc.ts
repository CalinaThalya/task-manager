
import { initTRPC } from "@trpc/server";

export const createTRPCContext = async (_opts: {
  headers: Headers;
}) => {
  void _opts;

  return {};
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
