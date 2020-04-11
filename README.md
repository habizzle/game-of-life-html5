Yet another client for Conway's Game of Life Web Service
===

This is an HTML5 based client of the REST-API offered by https://github.com/habizzle/game-of-life.

Development
---

Run locally for development with the awesome [browsersync](https://www.browsersync.io/):

```
$ npx browser-sync start --config bs-config.js
```

**NOTE**: 
npx is bundled with current npm installations.

After browsersync is started, you can access the application via http://localhost:3000.

Usage
---

See `src/index.html` for reference.

Use `data-server-url` attribute to configure the REST server url:

```html
<game-of-life
        data-server-url="http://localhost:1234"
        style="width: 100vw; height: 100vh;"/>
```

The default server url is `http://localhost:4567` (as it is the default of the REST server app).

**NOTE**:
It is recommended to explicitly set a size for the component.
If you want to have the component span the complete browser window, use

```css
width: 100vw; height: 100vh;
```

Deploy
---

**Locally**:

1. Build Docker image with `docker build --build-arg GAMEOFLIFE_SERVICE_URL=$GAMEOFLIFE_SERVICE_URL --tag istkorrekt/gameoflife-html5 .`
(`$GAMEOFLIFE_SERVICE_URL` is the desired default REST server url)
2. Run it with `docker run -p 1234:8080 gameoflife-html5`
(of course, you can forward port 8080 to whatever port you like, not just 1234)
3. Browse http://localhost:1234 to use full screen application or embed in your web page:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="http://localhost:1234/GameOfLife.js" type="module"></script>
</head>
<body>
<!-- 100vw / 100vh makes it use complete viewport size -->
<game-of-life style="width: 100vw; height: 100vh;"/>
</body>
</html>
```