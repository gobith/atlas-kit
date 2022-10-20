import { writable, get } from "svelte/store";

export const resize = writable({
  height: window.innerHeight,
  width: window.innerWidth,
});

export const scale = writable(0.2);

export const zoom = writable(3);

export const offset = writable({ x: 0, y: 0 });

export const cursor = writable({ x: 0, y: 0 });

export const clicked = writable({ x: 0, y: 0 });

export const settings = writable({
  showProvinces: true,
  showProvinceInfo: true,
  showRealms: true,
  showRealmInfo: true,
  shadowBlur: true,
});

export const selection = writable(null);

export const hoverSelection = writable(null);

export const resetResize = () => {
  resize.set({ height: window.innerHeight, width: window.innerWidth });
};

export const zoomIn = () => {
  privateZoomIn(window.innerWidth / 2, window.innerHeight / 2);
};

export const zoomOut = () => {
  privateZoomOut(window.innerWidth / 2, window.innerHeight / 2);
};

const events = new Map();

const handleWheelEvent = (event: any  ) => {
  if (event.wheelDelta > 0) {
    privateZoomIn(event.pageX, event.pageY);
  } else {
    privateZoomOut(event.pageX, event.pageY);
  }
};

const zoomValue = () => {
  return get(zoom);
};

const scaleIncrement = 2;
const zoomCap = 8;

const privateZoomIn = (x, y) => {
  if (zoomValue() === zoomCap) {
    return;
  }

  zoom.update((zoomNumber) => {
    return zoomNumber + 1;
  });

  scale.update((scaleNumber) => {
    return scaleNumber * scaleIncrement;
  });
  offset.update((offset) => {
    return {
      x: scaleIncrement * offset.x - x,
      y: scaleIncrement * offset.y - y,
    };
  });
};

const privateZoomOut = (x, y) => {
  if (zoomValue() === 1) {
    return;
  }

  zoom.update((zoomNumber) => {
    return zoomNumber - 1;
  });
  scale.update((scaleNumber) => {
    return scaleNumber / scaleIncrement;
  });
  offset.update((offset) => {
    return {
      x: (offset.x + x) / scaleIncrement,
      y: (offset.y + y) / scaleIncrement,
    };
  });
};

const handleResizeEvent = (event) => {
  resetResize();
};

const pointerdown_handler = (event) => {
  event.stopPropagation();
  events.set(event.pointerId, event);
};

const pointermove_handler = (event) => {
  event.stopPropagation();

  cursor.update((point) => {
    return { x: event.pageX, y: event.pageY };
  });
  const prevEvent = events.get(event.pointerId);

  if (prevEvent) {
    const movementX = event.pageX - prevEvent.pageX;
    const movementY = event.pageY - prevEvent.pageY;

    offset.update((offsetPoint) => {
      return {
        x: offsetPoint.x + movementX,
        y: offsetPoint.y + movementY,
      };
    });
    events.set(event.pointerId, event);
  }
};

const pointerup_handler = (event) => {
  event.stopPropagation();
  const prevEvent = events.get(event.pointerId);
  events.delete(event.pointerId);

  if (prevEvent.type === "pointerdown") {
    clicked.update((point) => {
      return { x: event.pageX, y: event.pageY };
    });
  }
};

export const attachResizeEvent = () => {
  window.onresize = handleResizeEvent;
};

export const detachResizeEvent = () => {};

export const attachEvents = (canvas) => {
  canvas.onwheel = handleWheelEvent;
  canvas.onpointerdown = pointerdown_handler;
  canvas.onpointermove = pointermove_handler;
  canvas.onpointerup = pointerup_handler;
};

export const detachEvents = (canvas) => {};
