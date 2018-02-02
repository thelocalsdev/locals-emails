var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pug = require('gulp-pug');
var postcss = require('gulp-postcss');
var cssImport = require('postcss-import');
var cssExtend = require('postcss-extend');
var nested = require('postcss-nested');
var precss = require('precss');
var cssVars = require('postcss-css-variables');
var simpleVars = require('postcss-simple-vars');
var cssnext = require('postcss-cssnext');
var inlineCss = require('gulp-inline-css');
var replace = require('gulp-replace');
var removeUncss = require('gulp-email-remove-unused-css');
var styleInject = require('gulp-style-inject');
var browserSync = require('browser-sync');
var githubPages = require('gulp-gh-pages');
var watch = require('gulp-watch');
var gutil = require('gulp-util');

var SRC = './src';
var DIST = './dist';

var CONFIG = {
  clean: {
    dest: [DIST]
  },
  browserSync: {
    port: 9000,
    open: true,
    server: {
      baseDir: [DIST]
    },
    files: [DIST + '/**']
  },
  githubPages: {
    src: DIST + '/**/*',
    options: {
      message: 'gh-pages'
    }
  },
  images: {
    src: SRC + '/images/**/*',
    dest: DIST + '/img'
  },
  styles: {
    inline: {
      src: SRC + '/styles/inline.css',
      dest: DIST + '/css'
    },
    embedded: {
      src: SRC + '/styles/embedded.css',
      dest: DIST + '/css'
    },
  },
  templates: {
    src: [
      SRC + '/templates/**/*.pug',
      '!' + SRC + '/templates/layout',
      '!' + SRC + '/templates/layout/**'
    ],
    dest: DIST
  },
  html: {
    src: DIST + '/*.html',
    inlineCss: {
      options: {
        applyStyleTags: false,
        removeStyleTags: false,
        applyTableAttributes: true
      },
    },
    dest: DIST
  }
}

gulp.task('[Emails] Clean', function(){
  return del(CONFIG.clean.dest);
});

gulp.task('[Emails] Images', function(){
  return gulp.src(CONFIG.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(CONFIG.images.dest))
});

gulp.task('[Emails] InlineStyles', function(){
  var processors = [
    cssImport,
    nested,
    precss,
    cssVars,
    simpleVars,
    cssExtend,
    cssnext({
      browsers: ['ie >= 8', 'last 10 versions', '> 1%']
    })
  ];

  return gulp.src(CONFIG.styles.inline.src)
    .pipe(postcss(processors))
    .on('error', gutil.log)
    .pipe(gulp.dest(CONFIG.styles.inline.dest));
});

gulp.task('[Emails] EmbeddedStyles', function(){
  var processors = [
    cssImport,
    nested,
    precss,
    cssVars,
    simpleVars,
    cssExtend,
    cssnext({
      browsers: ['ie >= 8', 'last 10 versions', '> 1%']
    })
  ];

  return gulp.src(CONFIG.styles.embedded.src)
    .pipe(postcss(processors))
    .on('error', gutil.log)
    .pipe(gulp.dest(CONFIG.styles.embedded.dest));
});

gulp.task('[Emails] Templates', function(){
  return gulp.src(CONFIG.templates.src)
    .pipe(pug({
      pretty: true
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(CONFIG.templates.dest));
});

gulp.task('[Emails] Html', function(){
  return gulp.src(CONFIG.html.src)
    .pipe(inlineCss(CONFIG.html.inlineCss.options).on('error', gutil.log))
    .pipe(styleInject())
    .pipe(replace(/\sstyle=\"\"/g, ''))
    .pipe(removeUncss({
      whitelist: ['.Email*']
    }))
    .pipe(gulp.dest(CONFIG.html.dest));
});

gulp.task('[Emails] BrowserSync', function(){
  browserSync(CONFIG.browserSync);
});

gulp.task('[Emails] GithubPages', function(){
  return gulp.src(CONFIG.githubPages.src)
    .pipe(githubPages(CONFIG.githubPages.options));
});

gulp.task('[Emails] Watch', ['[Emails] BrowserSync'], function(){
  watch(SRC + '/image/**/*', function(){
    gulp.start(['[Emails] Images']);
  });

  watch([
    SRC + '/styles/**/*',
    SRC + '/templates/**/*',
  ], function(){
    runSequence(
      [
        '[Emails] InlineStyles',
        '[Emails] EmbeddedStyles',
        '[Emails] Templates',
      ],
      '[Emails] Html'
    )
  });
});

gulp.task('build', ['[Emails] Clean'], function(cb){
  runSequence(
    [
      '[Emails] Images',
      '[Emails] InlineStyles',
      '[Emails] EmbeddedStyles',
      '[Emails] Templates',
    ],
    '[Emails] Html',
    cb
  );
});

gulp.task('deploy', ['build'], function(cb){
  runSequence(['[Emails] GithubPages'], cb);
});

gulp.task('default', ['build'], function(){
  gulp.start('[Emails] Watch');
});