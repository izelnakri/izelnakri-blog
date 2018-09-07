import Response from 'memserver/response';
import ENV from '../config/environment';

export default function({ BlogPost, Email, User }) {
  this.urlPrefix = ENV.APP ? ENV.APP.API_HOST : 'http://localhost:3000';

  this.post('/login', ({ params }) => {
    if (!params.email || !params.password) {
      return Response(401, { errors: { email: 'is required', password: 'is required' } });
    }

    const email = Email.findBy({ address: params.email });

    if (!email || !email.user_id) {
      return Response(401, { errors: { password: 'is invalid' } });
    }

    const user = User.find(email.user_id);

    if (params.password === user.password) {
      return { user: User.serializer(user) };
    }

    return Response(401, { errors: { password: 'is invalid' } });
  });

  this.get('/me', ({ headers }) => {
    const user = User.findFromHeaders(headers);

    return user ? { user: User.loginSerializer(user) } : Response(401, { message: 'unauthorized' });
  });

  this.get('/blog-posts', ({ queryParams }) => { // NOTE: HANDLE unpublished comments
    if (queryParams.filter && queryParams.filter === 'latest') {
      return { blog_posts: BlogPost.serializer(BlogPost.latest()) };
    } else if (queryParams.slug) {
      return { blog_post: BlogPost.serializer(BlogPost.findBy({ slug: queryParams.slug })) };
    }
  });

  this.post('/blog-posts', ({ headers, params }) => {
    const user = User.findFromHeaders(headers);

    if (!user) {
      return Response(401, { message: 'unauthorized' });
    }

    return BlogPost.create(Object.assign({}, params.blog_post, { user_id: user.id }));
  });

  this.put('/blog-posts/:id', ({ headers, params }) => {
    const user = User.findFromHeaders(headers);

    if (!user) {
      return Response(401, { message: 'unauthorized' });
    }

    const blogPost = BlogPost.find(params.id);

    if (!blogPost) {
      return Response(404, { message: 'Not found' });
    } else if (blogPost.user_id !== user.id) {
      return Response(401, { message: 'unauthorized' });
    }

    const blogPostParams = Object.take(params.blog_post, [
      'slug', 'title', 'markdown_content', 'meta_title', 'meta_description', 'published_at'
    ]);
    const updatedBlogPost = BlogPost.update(Object.assign({ id: params.id }, blogPostParams, {
      updated_at: (new Date()).toJSON()
    }));

    return { blog_post: BlogPost.serializer(updatedBlogPost) };
  });

  this.delete('/blog-posts/:id', ({ headers, params }) => {
    const user = User.findFromHeaders(headers);

    if (!user) {
      return Response(401, { message: 'unauthorized' });
    }

    const blogPost = BlogPost.find(params.id);

    if (!blogPost) {
      return Response(404, { message: 'Not found' });
    } else if (blogPost.user_id !== user.id) {
      return Response(401, { message: 'unauthorized' });
    }

    BlogPost.delete(params.id);

    return Response(204, {});
  });

  this.get('/comments', ({ queryParams }) => { // NOTE: HANDLE unpublished comments
    const blogPost = BlogPost.findBy({ slug: queryParams.slug });

    if (!queryParams.slug || !blogPost) {
      return Response(404);
    }

    return { comments: Comment.serializer(Comment.findBy({ blog_post_id: blogPost.id })) };
  });

  this.post('/comments', ({ headers, params }) => { // NOTE: create Email if not exists
    const user = User.findFromHeaders(headers);
    const emailId = user && Email.findBy({ user_id: user.id }).id;
    const comment = Comment.insert(Object.assign({}, params.comment, { email_id: emailId }));

    return { comment: Comment.serializer(comment) };
  });

  this.put('/comments/:id', ({ headers, params }) => {
    const user = User.findFromHeaders(headers);

    if (!user || !user.is_admin) {
      return Response(401, { message: 'unauthorized' });
    }

    const comment = Comment.find(params.id);

    if (!comment) {
      return Response(404, { message: 'Not found'});
    }

    return { comment: Comment.serializer(Comment.update(params)) };
  });

  this.delete('/comments/:id', ({ headers, params }) => {
    const comment = Comment.find(params.id);
    const user = User.findFromHeaders(headers);

    if (!user || !user.is_admin) {
      return Response(401, { message: 'unauthorized' });
    } else if (!comment) {
      return Response(404, { message: 'Not found'});
    }

    Comment.delete(params.id);

    return Response(204, {});
  });
}
