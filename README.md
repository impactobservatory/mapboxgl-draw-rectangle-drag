# Mapbox GL Draw Rectangle Drag
A Mapbox GL Draw plugin to create a rectangle via click &amp; drag.

Based on [`thegisdev/mapbox-gl-draw-rectangle-mode`](https://github.com/thegisdev/mapbox-gl-draw-rectangle-mode) plugin code and [`CartoDB/mapboxgl-draw-rectangle-drag`](https://github.com/CartoDB/mapboxgl-draw-rectangle-drag)

This fork of the repository adds the ability to either drag or click to create a rectangle, as well as a default to return to `drawConfig.defaultMode` (default to `simple_select`, but we use [`static`](mapbox/mapbox-gl-draw-static-mode))

## How to install
You can install this plugin using npm.

### Using npm
We deliver ESM compatible code through our npm module, so that you can import it in your project and compile it without issues.
```shell
npm i @impactobservatory/mapboxgl-draw-rectangle-drag --save
```
The module exports a default binding to the module, so you can import it like:
```js
import mapboxGLDrawRectangleDrag from '@impactobservatory/mapboxgl-draw-rectangle-drag';
```

## Usage
You need to follow these steps in order to enable the control in your Draw instance.

### Add mode to Mapbox GL Draw
Once the module/script is imported, you need to include the new mode within Mapbox GL's predefined modes.

To do so, you need to include `modes` property in your Mapbox GL Draw configuration options.
```js
var MapboxGLDraw = new MapboxDraw({
  modes: {
    ...MapboxDraw.modes,
    'draw_rectangle_drag': mapboxGLDrawRectangleDrag
  }
});
```

### How to enable rectangle drag mode
To enable the rectangle drag mode, you need to execute [`changeMode`](https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#changemodemode-string-options-object-draw) method on your Mapbox GL Draw instance.
```js
drawInstance.changeMode('draw_rectangle_drag');
```

Unfortunately, custom modes cannot add custom controls to Mapbox GL Draw plugins. So, if you want to have a custom button to enable the control you need to create one by yourself. You can take some ideas from [this CodePen](https://codepen.io/roblabs/pen/zJjPzX).

### How to get your feature
To do so, an event listener is needed. You need to listen to `draw.create` event on your map instance to get the definition of the feature that has just been created.

```js
map.on('draw.create', function (event) {
  console.log(e.features);
});
```

You can read more about it in [Draw documentation](https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#drawcreate).
