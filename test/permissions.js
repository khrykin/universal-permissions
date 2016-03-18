export const comment = {
  edit: (viewer, post) => (
    viewer.id == post.authorId
  )
};
