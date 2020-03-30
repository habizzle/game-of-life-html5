Yet another client for Conway's Game of Life Web Service
===

This is an HTML5 based client of the REST-API offered by https://github.com/habizzle/game-of-life.

Development
---

Run locally for development with the awesome [browsersync](https://www.browsersync.io/):

```
$ npx browser-sync start --config bs-config.js
```

---
**NOTE**

npx is bundled with current npm installations.

---

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

---
**NOTE**

It is recommended to explicitly set a size for the component.
If you want to have the component span the complete browser window, use

```css
width: 100vw; height: 100vh;
```

---