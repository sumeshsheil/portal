export {
    getCategories, getFeaturedPosts, getPostBySlug, getPosts, getPostsByCategory, searchPosts
} from "./api";
export type { Category, Post } from "./types";
export { extractFeaturedImage } from "./utils";
