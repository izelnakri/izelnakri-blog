export default function(ENV) {
  this.route('documentation', { path: ENV.documentation.path }, function() {
    this.route('index', { path: '/' });

    this.route('color-scheme');
    this.route('buttons');
    this.route('form');
    this.route('tables');
    this.route('icons');

    this.route('components', function() {
      this.route('in-header');
      this.route('modal');
    });

    this.route('others', function() {
      this.route('demo');
      this.route('snippet');
      this.route('header');
      this.route('viewer');
    });
  });
}
