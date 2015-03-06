
Predicates.userIdCanCreateBlogPost = function (userId) {
  return !!userId;
}

Predicates.userIdCanEditBlogPost = function (userId, blogPost) {
  return !!userId && !!blogPost && blogPost.createdBy === userId;
}
