<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    resize,
    scale,
    offset,
    clicked,
    settings,
    selection,
    attachEvents,
    detachEvents,
  } from "../stores/world-state";

  export let session;
  let canvas;
  let ctx;

  onMount(() => {
    attachEvents(canvas);
    ctx = canvas.getContext("2d");

    resize.subscribe((resize) => {
      drawBackground();
    });

    scale.subscribe((scaleNumber) => {
      drawBackground();
    });

    offset.subscribe((offsetPoint) => {
      drawBackground();
    });

    clicked.subscribe((point) => {
      pointClicked(point);
    });

    selection.subscribe((sel) => {
      drawBackground();
    });

    settings.subscribe((set) => {
      drawBackground();
    });
  });

  onDestroy(() => {
    detachEvents(canvas);
  });

  const shadowBlur = () => {
    if ($settings.shadowBlur) {
      return $scale;
    } else {
      0;
    }
  };

  const drawBackground = () => {
    canvas.height = $resize.height;
    canvas.width = window.innerWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate($offset.x, $offset.y);
    ctx.scale($scale, $scale);

    ctx.lineCap = "round";

    drawIslands(ctx);
    drawWoods(ctx);
    drawMountains(ctx);

    if ($settings.showRealms) {
      drawRealmBorders(ctx);
    }

    if ($settings.showProvinces) {
      drawProvinceBorders(ctx);
    }

    drawProvinceCenter(ctx);
    drawSelection(ctx);

    ctx.restore();
  };

  const drawProvinceCenter = (ctx) => {
    session.provinceAreas.forEach((area) => {
      if (area.province && area.province.name === "Tenarien") {
        const center = area.labelPoint;
        const bounds = area.polygon.bounds;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 15, 15, 0, 2 * Math.PI);
        ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
        ctx.stroke();
      }
    });
  };

  const drawIslands = (ctx) => {
    ctx.shadowColor = "rgba(255 , 255, 255 , 0.4)";
    ctx.shadowBlur = 50 * shadowBlur();
    ctx.fillStyle = "#EEE8AA";
    ctx.fill(session.islandsPath);
    ctx.stroke(session.islandsPath);
    ctx.shadowBlur = 0;
  };

  const drawWoods = (ctx) => {
    ctx.globalAlpha = 0.8;
    ctx.shadowColor = "darkgreen";
    ctx.shadowBlur = 50 * shadowBlur();
    ctx.clip(session.islandsPath);
    ctx.fillStyle = "#228B22";
    ctx.strokeStyle = "darkgreen";
    ctx.lineWidth = 2;
    ctx.fill(session.woodsPath);
    ctx.stroke(session.woodsPath);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const drawMountains = (ctx) => {
    ctx.globalAlpha = 0.3;
    ctx.shadowColor = "#654321";
    ctx.shadowBlur = 50 * shadowBlur();
    ctx.fillStyle = "#796342";
    ctx.strokeStyle = "#796342";
    ctx.lineWidth = 2;
    ctx.fill(session.mountainsPath);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const drawRealmBorders = (ctx) => {
    ctx.strokeStyle = "#654321";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;

    session.domains.forEach((domain) => {
      if (domain.realmArea) {
        //  ctx.fill(domain.realmArea.path);
        ctx.stroke(domain.realmArea.path);
      }
    });

    //ctx.stroke(session.realmBordersPath);
    ctx.lineWidth = 4;
    ctx.stroke(session.islandsPath);
    // ctx.shadowBlur = 0;
  };

  const drawProvinceBorders = (ctx) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#654321";
    ctx.setLineDash([10, 6]);
    ctx.lineWidth = 1;
    ctx.stroke(session.provinceBordersPath);
    ctx.setLineDash([0, 0]);
    ctx.shadowBlur = 0;
  };

  const drawSelection = (ctx) => {
    if (!$selection) {
      return;
    }

    ctx.setLineDash([0, 0]);
    ctx.shadowBlur = 0;
    ctx.lineWidth = 5;
    ctx.fillStyle = "rgba(220, 20, 60 , 0.6)";
    ctx.strokeStyle = "rgba(220, 20, 60 , 0.8)";

    // ctx.fill($selection.path);
    // ctx.stroke($selection.path);

    $selection.areas().forEach((area) => {
      ctx.fill(area.path);
      ctx.stroke(area.path);
    });
  };

  const pointClicked = (point) => {
    let selectedArea;

    // const areas = session.tree.tree.retrieve({
    //   x: $offset.x + point.x / $scale,
    //   y: $offset.y + point.y / $scale,
    //   width: 2,
    //   height: 2,
    // });

    ctx.save();
    ctx.translate($offset.x, $offset.y);
    ctx.scale($scale, $scale);

    // areas.forEach((area) => {
    //   if (ctx.isPointInPath(area.area.path, point.x, point.y)) {
    //     console.log("selected Area", area.area.province.name, area);
    //   }
    // });

    session.provinceAreas.forEach((area) => {
      if (ctx.isPointInPath(area.path, point.x, point.y)) {
       
        if ($selection === area.province) {
          selectedArea = null;
        } else {
          selectedArea = area;
        }
        // navigator.clipboard.writeText(`${area.center.x} @ ${area.center.y}`);
      }
    });
    ctx.restore();

    if (selectedArea) {
      selection.set(selectedArea.province);
    } else {
      selection.set(selectedArea);
    }
  };
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    background-color: #006994;
    position: absolute;
    top: 0px;
    left: 0px;
  }
</style>
