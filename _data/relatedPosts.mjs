/**
 * Related Posts Data Generator
 * Pre-calculates related posts based on shared tags for better performance
 */

export default {
  // Calculate related posts for a specific post
  calculateRelated(posts, currentPost, maxResults = 5) {
    if (!currentPost.data.tags || !Array.isArray(currentPost.data.tags)) {
      return [];
    }

    const currentTags = this.filterTagList(currentPost.data.tags);
    const relatedPosts = [];

    for (const post of posts) {
      // Skip current post and drafts
      if (post.url === currentPost.url || post.data.draft) {
        continue;
      }

      const postTags = this.filterTagList(post.data.tags || []);
      const matchingTags = this.countMatchingTags(currentTags, postTags);

      if (matchingTags > 0) {
        relatedPosts.push({
          url: post.url,
          title: post.data.title,
          description: post.data.description,
          date: post.data.date,
          matches: matchingTags,
          tags: postTags,
          category: post.data.category,
        });
      }
    }

    // Sort by number of matching tags (descending), then by date (newest first)
    relatedPosts.sort((a, b) => {
      if (a.matches !== b.matches) {
        return b.matches - a.matches;
      }
      return new Date(b.date) - new Date(a.date);
    });

    return relatedPosts.slice(0, maxResults);
  },

  // Filter out system tags
  filterTagList(tags) {
    if (!Array.isArray(tags)) return [];
    return tags.filter(
      (tag) =>
        !["all", "nav", "post", "posts", "[articles]", "[archive]"].includes(
          tag
        )
    );
  },

  // Count matching tags between two arrays
  countMatchingTags(tags1, tags2) {
    let count = 0;
    for (const tag of tags1) {
      if (tags2.includes(tag)) {
        count++;
      }
    }
    return count;
  },

  // Generate a complete related posts map for all posts
  generateRelatedPostsMap(collections) {
    const posts = collections.posts || [];
    const relatedPostsMap = new Map();

    for (const post of posts) {
      if (!post.data.draft) {
        const related = this.calculateRelated(posts, post);
        relatedPostsMap.set(post.url, related);
      }
    }

    return Object.fromEntries(relatedPostsMap);
  },

  // Get content similarity score (for future enhancement)
  calculateContentSimilarity(post1, post2) {
    // Simple implementation - can be enhanced with more sophisticated algorithms
    const words1 = this.extractWords(
      post1.data.description || post1.data.title || ""
    );
    const words2 = this.extractWords(
      post2.data.description || post2.data.title || ""
    );

    const commonWords = words1.filter((word) => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;

    return totalWords > 0 ? commonWords.length / totalWords : 0;
  },

  // Extract meaningful words from text
  extractWords(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3) // Filter out short words
      .filter(
        (word) =>
          ![
            "with",
            "from",
            "that",
            "this",
            "have",
            "will",
            "your",
            "they",
            "were",
            "been",
            "their",
            "said",
            "each",
            "which",
            "them",
            "more",
            "very",
            "what",
            "know",
            "just",
            "first",
            "into",
            "over",
            "think",
          ].includes(word)
      ); // Filter common words
  },
};
