import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getURL = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async(ctx, args0) => {
        // ctx.storage.getUrl() is a convex function. It means get the storage url of the file with the storageId "args0.storageId"
        return await ctx.storage.getUrl(args0.storageId)
    },
});

export const createPodcast = mutation ({
    args: {
        podcastTitle:v.string(),
        podcastDescription: v.string(),
        audioURL: v.string(),
        imageURL: v.string(),
        voiceType: v.string(),
        voicePrompt: v.string(),
        imagePrompt: v.string(),
        views: v.number(),
        audioDuration: v.number(),
        audioStorageId: v.id('_storage'),
        imageStorageId: v.id('_storage'),
    },
    handler: async(ctx, args) => {

        // to generate a podcast, we first need to verify that the user trying to create a podcast is in fact logged in through clerk
        // Then, we need to check if the user, who we now know is logged in, exists in our convex database. 
        // We check authentication (even though the /create-podcast page is protected by authentication) because every podcast must have an author. If the author is not another user in the database, there could be bad errors.
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new ConvexError("User not authenticated when creating podcast")
        }
        
        // Go to the database and get the list of all users in Podify.
        // Filter out everyone except for the one user with the same email as the user who is in the current session trying to create a podcast
        const user = await ctx.db.query('users').filter((q) => q.eq(q.field('email'), identity.email)).collect();

        // if the user.length is 0, then it means no users in the database has an email that is equal to the current user's email. This means something is wrong with our database
        if(user.length == 0)
            throw new ConvexError("ERROR: User is not found in the convex users database");

        const podcast = await ctx.db.insert('podcasts', {
            audioStorageId: args.audioStorageId,
            user: user[0]._id,
            podcastTitle: args.podcastTitle,
            podcastDescription: args.podcastDescription,
            audioURL: args.audioURL,
            imageURL: args.imageURL,
            imageStorageId: args.imageStorageId,
            author: user[0].username,
            authorId: user[0].clerkId,
            voicePrompt: args.voicePrompt,
            imagePrompt: args.imagePrompt,
            voiceType: args.voiceType,
            views: args.views,
            authorImageURL: user[0].imageURL,
            audioDuration: args.audioDuration,
        });

        return podcast;
    },
});

export const getTrendingPodcasts = query({
    handler: async(ctx) => {
        const podcasts = await ctx.db.query('podcasts').collect();
        return podcasts;
    }
})