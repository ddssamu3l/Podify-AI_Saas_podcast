import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const getURL = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async(ctx, args0) => {
        // ctx.storage.getUrl() is a convex function. It means get the storage url of the file with the storageId "args0.storageId"
        return await ctx.storage.getUrl(args0.storageId)
    }
})