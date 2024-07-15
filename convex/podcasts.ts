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
    handler: async (ctx) => {
      const podcast = await ctx.db.query("podcasts").collect();
  
      return podcast.sort((a, b) => b.views - a.views).slice(0, 8);
    },
  });

export const getPodcastById = query({
    args: {
        podcastId: v.id("podcasts"),
    },
    handler: async(ctx, args0) => {
        const podcasts = await ctx.db.get(args0.podcastId);
        return podcasts;
    }
})

// this query will get all podcasts with the same voice type as the podcast that will be calling this query as the args take in a podcastId. the podcastId is then used to get the voice type of the current podcast.
export const getPodcastByVoiceType = query({
    args: {
      podcastId: v.id("podcasts"),
    },
    handler: async (ctx, args) => {
      const podcast = await ctx.db.get(args.podcastId);

      return await ctx.db
        .query("podcasts")
        .filter((q) =>
          q.and(
            q.eq(q.field("voiceType"), podcast?.voiceType),
            q.neq(q.field("_id"), args.podcastId)
          )
        )
        .collect();
    },
  });
  
// this query will get all the podcasts.
export const getAllPodcasts = query({
    handler: async (ctx) => {
      return await ctx.db.query("podcasts").order("desc").collect();
    },
});

export const getPodcastByAuthorId = query({
    args: {
      authorId: v.string(),
    },
    handler: async (ctx, args) => {
      const podcasts = await ctx.db
        .query("podcasts")
        .filter((q) => q.eq(q.field("authorId"), args.authorId))
        .collect();
  
      const totalListeners = podcasts.reduce(
        (sum, podcast) => sum + podcast.views,
        0
      );
  
      return { podcasts, listeners: totalListeners };
    },
  });
  
  // this query will get the podcast by the search query.
  export const getPodcastBySearch = query({
    args: {
      search: v.string(),
    },
    handler: async (ctx, args) => {
      if (args.search === "") {
        return await ctx.db.query("podcasts").order("desc").collect();
      }
  
      const authorSearch = await ctx.db
        .query("podcasts")
        .withSearchIndex("search_author", (q) => q.search("author", args.search))
        .take(10);
  
      if (authorSearch.length > 0) {
        return authorSearch;
      }
  
      const titleSearch = await ctx.db
        .query("podcasts")
        .withSearchIndex("search_title", (q) =>
          q.search("podcastTitle", args.search)
        )
        .take(10);
  
      if (titleSearch.length > 0) {
        return titleSearch;
      }

      const descriptionSearch = await ctx.db
        .query("podcasts")
        .withSearchIndex("search_description", (q) =>
          q.search("podcastDescription", args.search)
        )
        .take(10);
  
      if (descriptionSearch.length > 0) {
        return descriptionSearch;
      }
  
      return await ctx.db
        .query("podcasts")
        .withSearchIndex("search_prompt", (q) =>
          q.search("voicePrompt", args.search)
        )
        .take(10);
    },
  });
  
  // this mutation will update the views of the podcast.
  export const updatePodcastViews = mutation({
    args: {
      podcastId: v.id("podcasts"),
    },
    handler: async (ctx, args) => {
      const podcast = await ctx.db.get(args.podcastId);
  
      if (!podcast) {
        throw new ConvexError("Podcast not found");
      }
  
      return await ctx.db.patch(args.podcastId, {
        views: podcast.views + 1,
      });
    },
  });
  
  // this mutation will delete the podcast.
  export const deletePodcast = mutation({
    args: {
      podcastId: v.id("podcasts"),
      imageStorageId: v.id("_storage"),
      audioStorageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
      const podcast = await ctx.db.get(args.podcastId);
  
      if (!podcast) {
        throw new ConvexError("Podcast not found");
      }
  
      await ctx.storage.delete(args.imageStorageId);
      await ctx.storage.delete(args.audioStorageId);
      return await ctx.db.delete(args.podcastId);
    },
  });

  export const getSimilarPodcasts = query({
    args: {
        podcastId: v.id("podcasts"),
    },
    handler: async (ctx, args) => {
        const podcast = await ctx.db.get(args.podcastId);

        const similarPodcasts = await ctx.db
            .query("podcasts")
            .filter((q) =>
            q.and(
                q.eq(q.field("authorId"), podcast?.authorId),
                q.neq(q.field("_id"), podcast?._id),
            )
            )
            .collect();

        return similarPodcasts.slice(0,4);
    },
  });