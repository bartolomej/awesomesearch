module.exports.react = `
    <html>
    <head>
        <link rel="preload" href="https://unpkg.com/docsearch.js@2.4.1/dist/cdn/docsearch.min.js" as="script">
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="/favicon.ico">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <link rel="apple-touch-icon" href="/logo-180x180.png">
        <meta name="apple-mobile-web-app-title" content="React">
        <link rel="preconnect dns-prefetch" href="https://www.google-analytics.com">
        <link rel="alternate" type="application/rss+xml" href="/feed.xml">
        <title>React – A JavaScript library for building user interfaces</title>
        <link data-react-helmet="true" rel="canonical" href="https://reactjs.org/">
        <link data-react-helmet="true" rel="alternate" href="https://reactjs.org/" hreflang="x-default">
        <link data-react-helmet="true" rel="alternate" hreflang="en" href="https://reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="ar" href="https://ar.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="az" href="https://az.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="es" href="https://es.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="fr" href="https://fr.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="it" href="https://it.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="ja" href="https://ja.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="ko" href="https://ko.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="mn" href="https://mn.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="pl" href="https://pl.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="pt-br" href="https://pt-br.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="ru" href="https://ru.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="tr" href="https://tr.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="uk" href="https://uk.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="zh-hans" href="https://zh-hans.reactjs.org/">
        <link data-react-helmet="true" rel="alternate" hreflang="zh-hant" href="https://zh-hant.reactjs.org/">
        <meta data-react-helmet="true" property="og:title"
              content="React – A JavaScript library for building user interfaces">
        <meta data-react-helmet="true" property="og:type" content="website">
        <meta data-react-helmet="true" property="og:url" content="https://reactjs.org/">
        <meta data-react-helmet="true" property="og:image" content="https://reactjs.org/logo-og.png">
        <meta data-react-helmet="true" property="og:description"
              content="A JavaScript library for building user interfaces">
        <meta data-react-helmet="true" property="fb:app_id" content="623268441017527">
        <link rel="icon" href="/icons/icon-48x48.png?v=a95b1cba85b449d3cf230505f32a3d42">
        <link rel="manifest" href="/manifest.webmanifest">
        <meta name="theme-color" content="#20232a">
        <link rel="apple-touch-icon" sizes="48x48" href="/icons/icon-48x48.png?v=a95b1cba85b449d3cf230505f32a3d42">
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png?v=a95b1cba85b449d3cf230505f32a3d42">
        <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png?v=a95b1cba85b449d3cf230505f32a3d42">
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png?v=a95b1cba85b449d3cf230505f32a3d42">
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png?v=a95b1cba85b449d3cf230505f32a3d42">
        <link rel="apple-touch-icon" sizes="256x256" href="/icons/icon-256x256.png?v=a95b1cba85b449d3cf230505f32a3d42">
        <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png?v=a95b1cba85b449d3cf230505f32a3d42">
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png?v=a95b1cba85b449d3cf230505f32a3d42">
        <link as="script" rel="preload" href="/webpack-runtime-96f452f57210d2c6f60a.js">
        <link as="script" rel="preload" href="/styles-b3b848542632cf53386b.js">
        <link as="script" rel="preload" href="/app-bac11547738b23814503.js">
        <link as="script" rel="preload" href="/commons-2702e000a5a15632ddf5.js">
        <link as="script" rel="preload" href="/component---src-pages-index-js-fc9730f04d2682774315.js">
        <link as="fetch" rel="preload" href="/page-data/index/page-data.json" crossorigin="anonymous">
        <link as="fetch" rel="preload" href="/page-data/app-data.json" crossorigin="anonymous">
        <link rel="prefetch" href="/page-data/docs/getting-started.html/page-data.json" crossorigin="anonymous"
              as="fetch">
        <link rel="prefetch" href="/page-data/tutorial/tutorial.html/page-data.json" crossorigin="anonymous" as="fetch">
        <link rel="prefetch" href="/page-data/community/support.html/page-data.json" crossorigin="anonymous" as="fetch">
        <link rel="prefetch" href="/page-data/versions/page-data.json" crossorigin="anonymous" as="fetch">
        <link rel="prefetch" href="/page-data/tutorial/tutorial.html/page-data.json" crossorigin="anonymous" as="fetch">
        <link rel="prefetch" href="/page-data/docs/getting-started.html/page-data.json" crossorigin="anonymous"
              as="fetch">
        <link rel="prefetch" href="/page-data/blog/page-data.json" crossorigin="anonymous" as="fetch">
        <link rel="prefetch" href="/page-data/languages/page-data.json" crossorigin="anonymous" as="fetch">
        <link rel="prefetch" href="/component---src-pages-versions-js-e4b439ab9a7204fa4abf.js">
        <link rel="prefetch" href="/component---src-templates-community-js-01ff59f944367e2d5816.js">
        <link rel="prefetch" href="/component---src-templates-tutorial-js-6f8fdc851099a8fb51a1.js">
        <link rel="prefetch" href="/component---src-templates-docs-js-38dcbbdfcf0b84bad939.js">
        <link rel="prefetch" href="/component---src-pages-languages-js-2c6bd7a7420b6392de7e.js">
    </head>
    </html>
`;

module.exports.flutterHtml = `
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Flutter - Beautiful native apps in record time </title>
        <link rel="shortcut icon" href="/images/favicon.png">
        <meta name="description"
              content="Flutter is Google's UI toolkit for crafting beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.  Flutter works with existing code, is used by developers and organizations around the world, and is free and open source.">
        <meta name="keywords" content=" ">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@flutterdev">

        <meta property="og:title" content="Flutter - Beautiful native apps in record time">
        <meta property="og:url" content="https://flutter.dev/">
        <meta property="og:description"
              content="Flutter is Google's UI toolkit for crafting beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.  Flutter works with existing code, is used by developers and organizations around the world, and is free and open source.">

        <meta property="og:image" content="https://flutter.dev/images/flutter-logo-sharing.png">

        <link href="https://fonts.googleapis.com/css?family=Google+Sans:400,500|Roboto:300,400,500|Roboto+Mono:400,700|Material+Icons"
              rel="stylesheet">
        <link rel="stylesheet" type="text/css"
              href="/assets/main-094812bce4cc4b3c1ece24851a2ac506e83ffa17701779ac96ca5c4d659423e5.css"
              integrity="sha256-CUgSvOTMSzweziSFGirFBug/+hdwF3mslspcTWWUI+U=" crossorigin="anonymous">

        <meta name="google-site-verification" content="HFqxhSbf9YA_0rBglNLzDiWnrHiK_w4cqDh2YD2GEY4">
        <meta name="google-site-verification" content="Zom-prnFykfYycmI_nzRWYx5r6Z9OwR-yEsgElRz_Ug">
    </head>
    </html>
`;

module.exports.reactNativeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>React Native · A framework for building native apps using React</title>
        <meta name="viewport" content="width=device-width">
        <meta name="generator" content="Docusaurus">
        <meta name="description" content="A framework for building native apps using React">
        <meta property="og:title" content="React Native · A framework for building native apps using React">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://reactnative.dev/">
        <meta property="og:description" content="A framework for building native apps using React">
        <meta name="twitter:card" content="summary">
        <link rel="shortcut icon" href="/img/favicon.ico">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.css">
        <link rel="stylesheet"
              href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/solarized-dark.min.css">
        <link rel="alternate" type="application/atom+xml" href="https://reactnative.dev/blog/atom.xml"
              title="React Native Blog ATOM Feed">
        <link rel="alternate" type="application/rss+xml" href="https://reactnative.dev/blog/feed.xml"
              title="React Native Blog RSS Feed">
    </head>
    <body>

    </body>
    </html>
`;

module.exports.nodejsHtml = `

    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link id="favicon" rel="icon" href="favicon.ico?v=3" type="image/x-icon">
        <link id="apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png?v=3">
        <link id="oembed" rel="alternate" type="application/json+oembed"
              href="https://api.glitch.com/projects/nodejs-dev-0001-01/oembed" title="nodejs-dev-0001-01 oembed link">
        <link rel="stylesheet" type="text/css"
              href="https://cloud.webtype.com/css/3a8e55c6-b1f3-4659-99eb-125ae72bd084.css">

        <link class="theme" type="text/css" href="themes/cosmos.version.5b347a3ad6eb656473c0.css">

        <link class="theme" rel="stylesheet" type="text/css" href="themes/sugar.version.818425b8a25a3a6ee721.css">


        <title>server.js – nodejs-dev-0001-01</title>
        <noscript>
            <title>Glitch</title>
        </noscript>

        <meta name="description"
              content="Combining automated deployment, instant hosting &amp; collaborative editing, Glitch gets you straight to coding so you can build full-stack web apps, fast">
        <meta name="keywords"
              content="developer, javascript, nodejs, editor, ide, development, online, web, code editor, html, css">

        <!-- facebook open graph tags -->
        <meta name="og:type" content="website">
        <meta name="og:url" content="https://glitch.com">
        <meta name="og:title" content="Glitch">
        <meta name="og:description"
              content="Combining automated deployment, instant hosting &amp; collaborative editing, Glitch gets you straight to coding so you can build full-stack web apps, fast">
        <meta name="og:image" content="https://glitch.com/edit/images/logos/glitch/social-card@2x.png">
        <!-- twitter card tags (stacks with og: tags) -->
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@glitch">
        <meta name="twitter:title" content="Glitch">
        <meta name="twitter:description"
              content="Combining automated deployment, instant hosting &amp; collaborative editing, Glitch gets you straight to coding so you can build full-stack web apps, fast">
        <meta name="twitter:image" content="https://glitch.com/edit/images/logos/glitch/social-card@2x.png">
        <meta name="twitter:image:alt" content="Glitch Logo">
        <meta name="twitter:url" content="https://glitch.com">

    </head>
    </html>
`;

module.exports.kotlinHtml = `
    <head>
        <meta charset="utf-8">

        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <link rel="Shortcut Icon" href="/assets/images/favicon.ico" type="image/x-icon">
        <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/assets/images/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/assets/images/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/assets/images/apple-touch-icon-144x144.png">
        <link rel="stylesheet" href="/_assets/styles.css?&amp;v=d8b80d53134a6b022602a0d7d791f9b6">

        <meta property="og:title" content="">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://kotlinlang.org/">
        <meta property="og:image" content="https://kotlinlang.org/assets/images/open-graph/kotlin_250x250.png">
        <meta property="og:description" content="">
        <meta property="og:site_name" content="Kotlin">

        <!-- Twitter Card data -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@kotlin">
        <meta name="twitter:title" content="">
        <meta name="twitter:description" content="">
        <meta name="twitter:image:src" content="https://kotlinlang.org/assets/images/twitter-card/kotlin_800x320.png">
        <!-- Social Media tag Ends -->
        <link rel="stylesheet" href="/_assets/index.css?&amp;v=f75d3e5ee520bcf5816b96ba8bdf0f18">


        <title>Kotlin Programming Language</title>
    </head>`;

module.exports.awesomeRootMarkdown = `
<div align="center">
	<img width="500" height="350" src="media/logo.svg" alt="Awesome">
	<br>
	<br>
	<hr>
	<p>
		<p>
			<sup>
				<a href="https://github.com/sponsors/sindresorhus">My open source work is supported by the community</a>
			</sup>
		</p>
		<sup>Special thanks to:</sup>
		<br>
		<br>
		<a href="https://github.com/botpress/botpress">
			<img src="https://sindresorhus.com/assets/thanks/botpress-logo.svg" width="260" alt="Botpress">
		</a>
		<br>
		<sub><b>Botpress is an open-source conversational assistant creation platform.</b></sub>
		<br>
		<sub>They <a href="https://github.com/botpress/botpress/blob/master/.github/CONTRIBUTING.md">welcome contributions</a> from anyone, whether you're into machine learning,<br>want to get started in open-source, or just have an improvement idea.</sub>
		<br>
	</p>
	<hr>
	<br>
	<br>
	<br>
	<br>
</div>

<p align="center">
	<a href="awesome.md">What is an awesome list?</a>&nbsp;&nbsp;&nbsp;
	<a href="contributing.md">Contribution guide</a>&nbsp;&nbsp;&nbsp;
	<a href="create-list.md">Creating a list</a>&nbsp;&nbsp;&nbsp;
	<a href="https://twitter.com/awesome__re">Twitter</a>&nbsp;&nbsp;&nbsp;
	<a href="https://www.redbubble.com/people/sindresorhus/works/30364188-awesome-logo">Stickers & t-shirts</a>
</p>

<br>

<div align="center">
	<b>Follow the <a href="https://twitter.com/awesome__re">Awesome Twitter account</a> for updates on new list additions.</b>
</div>

<br>

<p align="center">
	<sub>Just type <a href="https://awesome.re"><code>awesome.re</code></a> to go here. Check out my <a href="https://blog.sindresorhus.com">blog</a> and follow me on <a href="https://twitter.com/sindresorhus">Twitter</a>.</sub>
</p>
<br>

## Contents

- [Platforms](#platforms)
- [Programming Languages](#programming-languages)
- [Front-End Development](#front-end-development)
- [Back-End Development](#back-end-development)
- [Computer Science](#computer-science)
- [Big Data](#big-data)
- [Theory](#theory)
- [Books](#books)
- [Editors](#editors)
- [Gaming](#gaming)
- [Development Environment](#development-environment)
- [Entertainment](#entertainment)
- [Databases](#databases)
- [Media](#media)
- [Learn](#learn)
- [Security](#security)
- [Content Management Systems](#content-management-systems)
- [Hardware](#hardware)
- [Business](#business)
- [Work](#work)
- [Networking](#networking)
- [Decentralized Systems](#decentralized-systems)
- [Higher Education](#higher-education)
- [Events](#events)
- [Testing](#testing)
- [Miscellaneous](#miscellaneous)
- [Related](#related)

## Platforms

- [Node.js](https://github.com/sindresorhus/awesome-nodejs#readme) - Async non-blocking event-driven JavaScript runtime built on Chrome's V8 JavaScript engine.

`;

module.exports.awesomeRootParseMarkdown = `
# <img src="http://i.imgur.com/yy1sACZ.png" width="100px"/> ECMAScript 6 Tools [![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)

## Contents

- [Platforms](#platforms)
- [Programming Languages](#programming-languages)
- [Front-End Development](#front-end-development)
- [Back-End Development](#back-end-development)

## Transpilers

* [Babel](https://github.com/babel/babel) - Turn ES6+ code into vanilla ES5 with no runtime
* [Traceur compiler](https://github.com/google/traceur-compiler)

## Build-time transpilation

### Gulp Plugins
* Babel: [gulp-babel](https://github.com/babel/gulp-babel)

### Platforms

- [Node.js](https://github.com/sindresorhus/awesome-nodejs#readme) - Async non-blocking event-driven JavaScript runtime.
	- [Cross-Platform](https://github.com/bcoe/awesome-cross-platform-nodejs#readme)

`;

module.exports.awesomeNodejsMarkdown = `
## Contents

- [Packages](#packages)
- [Mad science](#mad-science)
- [Command-line apps](#command-line-apps)

## Packages

### Mad science

- [rn](https://reactnative.dev/) - Streaming torrent client for Node.js and the browser.
- [r](https://reactjs.org/) - Streaming torrent client for Node.js and the browser.
- [r](https://flutter.dev/) - Streaming torrent client for Node.js and the browser.
- [r](https://kotlinlang.org/) - Streaming torrent client for Node.js and the browser.
`;
