import createRectangle from './utils/create-rectangle';
import { enableZoom, disableZoom } from './utils/zoom';

const DrawRectangleDrag = {
  onSetup() {
    const rectangle = this.newFeature(createRectangle());
    this.addFeature(rectangle);

    this.clearSelectedFeatures();

    // UI Tweaks
    this.updateUIClasses({ mouse: 'add' });
    this.setActionableState({ trash: true });
    disableZoom(this);

    return { rectangle };
  },

  onClick(state, event) {

    // if state.startPoint exist, means its second click
    if (
      state.startPoint &&
      state.startPoint[0] !== event.lngLat.lng &&
      state.startPoint[1] !== event.lngLat.lat
    ) {
      return this.onRectangleDone(state, event);
    }

    return this.onRectangleStart(state, event);
  },

  onDrag(state, event) {
    event.preventDefault();
    return this.onRectangleDraw(state, event);
  },

  onKeyUp: function(state, event) {
    if (event.keyCode === 27) return this.changeMode(this.drawConfig.defaultMode);
  },

  onMouseUp(state, event) {
    event.preventDefault();
    return this.onClick(state, event);
  },

  onMouseDown(state, event) {
    event.preventDefault();
    return this.onClick(state, event);
  },

  onMouseMove: function(state, event) {
    return this.onRectangleDraw(state, event);
  },

  onRectangleStart(state, event) {
    const startPoint = [event.lngLat.lng, event.lngLat.lat];
    state.startPoint = startPoint;

    // Starting point - minX,minY
    state.rectangle.updateCoordinate(
      '0.0',
      state.startPoint[0],
      state.startPoint[1]
    );
  },

  onRectangleDraw(state, event) {
    if (!state.startPoint) {
      return;
    }

    // Upper right vertex - maxX, minY
    state.rectangle.updateCoordinate(
      '0.1',
      event.lngLat.lng,
      state.startPoint[1]
    );

    // Lower right vertex - maxX, maxY
    state.rectangle.updateCoordinate(
      '0.2',
      event.lngLat.lng,
      event.lngLat.lat
    );

    // Lower left vertex - minX, maxY
    state.rectangle.updateCoordinate(
      '0.3',
      state.startPoint[0],
      event.lngLat.lat
    );

    // Starting point again
    state.rectangle.updateCoordinate(
      '0.4',
      state.startPoint[0],
      state.startPoint[1]
    );
  },

  onRectangleDone(state, event) {
    state.endPoint = [event.lngLat.lng, event.lngLat.lat];

    this.updateUIClasses({ mouse: 'pointer' });
    this.changeMode(this.drawConfig.defaultMode, { featuresId: state.rectangle.id });

  // support mobile taps
  onTap: function(state, e) {
    // emulate 'move mouse' to update feature coords
    if (state.startPoint) this.onMouseMove(state, e);
    // emulate onClick
    this.onClick(state, e);
  },

  onStop(state) {
    enableZoom(this);
    this.updateUIClasses({ mouse: 'none' });

    if (!this.getFeature(state.rectangle.id)) {
      return;
    }

    // Remove latest coordinate
    state.rectangle.removeCoordinate('0.4');

    if (state.rectangle.isValid()) {
      this.map.fire('draw.create', {
        features: [state.rectangle.toGeoJSON()]
      });
      return;
    }

    this.deleteFeature([state.rectangle.id], { silent: true });
    this.changeMode(this.drawConfig.defaultMode, {}, { silent: true });
  },

  onTrash(state) {
    this.deleteFeature([state.rectangle.id], { silent: true });
    this.changeMode(this.drawConfig.defaultMode);
  },

  toDisplayFeatures(state, geojson, display) {
    const isActivePolygon = geojson.properties.id === state.rectangle.id;
    geojson.properties.active = isActivePolygon.toString();

    if (!isActivePolygon) {
      display(geojson);
      return;
    }

    if (!state.startPoint) {
      return;
    }

    display(geojson);
  },
};

export default DrawRectangleDrag;
