<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    resize,
    cursor,
    scale,
    offset,
    hoverSelection,
  } from "../stores/world-state";

  export let session;
  let canvas;
  let ctx;
  let current = { x: 0, y: 0 };
  let timeout;

  onMount(() => {
    ctx = canvas.getContext("2d");

    resize.subscribe((resize) => {
      canvas.height = resize.height;
      canvas.width = window.innerWidth;
    });

    cursor.subscribe((cursorPoint) => {
      clearTimeout(timeout);
      hoverSelection.set(null);
      current = cursorPoint;

      timeout = setTimeout(hover, 600);
    });
  });

  const hover = () => {
    let selectedArea;

    ctx.save();
    ctx.translate($offset.x, $offset.y);
    ctx.scale($scale, $scale);

    session.provinceAreas.forEach((area) => {

      const path = new Path2D();
      const center = area.labelPoint;
      path.arc(center.x, center.y, 15, 15, 0, 2 * Math.PI);
      if (ctx.isPointInPath(path, current.x, current.y)) {
        selectedArea = area;
      }
    });
    ctx.restore();

    if (selectedArea) {
      hoverSelection.set(selectedArea.province);
    } else {
      hoverSelection.set(selectedArea);
    }
  };
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>
