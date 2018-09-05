import Response from 'memserver/response';
import ENV from '../config/environment';

export default function({ BlogPost, Email, User }) {
  this.urlPrefix = ENV.APP ? ENV.APP.API_HOST : 'http://localhost:3000';

  // this.get('/users/:id', (request) => {
  //   return { user: { id: 1, name: 'Izel' } };
  // })

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

  this.get('/blog-posts', ({ queryParams }) => {
    if (queryParams.filter && queryParams.filter === 'latest') {
      return { blog_posts: BlogPost.serializer(BlogPost.latest()) };
    } else if (queryParams.slug) {
      return { blog_post: BlogPost.serializer(BlogPost.findBy({ slug: queryParams.slug })) };
    }
  });

  // this.post('/blog-posts', () => {
  //
  // });
  //
  // this.put('/blog-posts/:id', () => {
  //
  // });
  //
  // this.delete('/blog-posts/:id', () => {
  //
  // });
  //
  // this.get('/comments', () => {
  //
  // });
  //
  // this.post('/comments', () => {
  //
  // });
  //
  // this.put('/comments/:id', () => {
  //
  // });
  //
  // this.delete('/comments/:id', () => [
  //
  // ]);
}
