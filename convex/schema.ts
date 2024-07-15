import {defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// a Schema defines how data is stored in the database
export default defineSchema({
    // here we define what a "podcast" should store
    podcasts: defineTable({
        // v.union() describes fiends that could be of multiple types.
        // v.optional means it's either the type defined in the brackets or it's null   
        user: v.id('users'),
        podcastTitle: v.string(),
        podcastDescription: v.string(),
        audioURL: v.optional(v.string()),
        audioStorageId: v.optional(v.id('_storage')),
        imageURL: v.optional(v.string()),
        imageStorageId: v.optional(v.id('_storage')),
        // we include the author so that we don't have to make relations between a podcast and a user. Instead, we can access the author's infos directly from a podcast
        author: v.string(),
        authorId: v.string(),
        authorImageURL: v.string(),
        voicePrompt: v.string(), // the script that the AI will read
        imagePrompt: v.string(),
        voiceType: v.string(), // the voice name thatthe AI will read the prompt in
        audioDuration: v.number(),
        views: v.number(),

    })
    .searchIndex('search_author', {searchField: 'author'})
    .searchIndex('search_title', {searchField: 'podcastTitle'})
    .searchIndex('search_description', {searchField: 'podcastDescription'})
    .searchIndex('search_prompt', {searchField: 'voicePrompt'}),

    users: defineTable({
        email: v.string(),
        imageURL: v.string(),
        clerkId: v.string(),
        username: v.string(),
    })
})