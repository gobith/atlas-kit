<script lang="ts">
  import { onMount } from "svelte";
  import {
    resize,
    scale,
    offset,
    settings,
    zoom,
  } from "../stores/world-state";

  export let session;
  let canvas;

  const drawDescriptions = () => {
    const ctx = canvas.getContext("2d");

    canvas.height = $resize.height;
    canvas.width = window.innerWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate($offset.x, $offset.y);
    ctx.scale($scale, $scale);

    if ($settings.showProvinceInfo) {
      drawProvinceInfo(ctx);
    } else {
      drawRealmInfo(ctx);
    }
    ctx.restore();
  };

  onMount(() => {
    drawDescriptions();

    resize.subscribe((resize) => {
      drawDescriptions();
    });

    scale.subscribe((scaleNumber) => {
      drawDescriptions();
    });

    offset.subscribe((offsetPoint) => {
      drawDescriptions();
    });

    settings.subscribe((settingsObject) => {
      drawDescriptions();
    });
  });

  const drawRealmInfo = (ctx) => {
    ctx.strokeStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    session.domains.forEach((domain) => {
      if (domain.realmArea) {
        ctx.font = "bold 30px calibri";
        ctx.fillText(
          domain.name,
          domain.realmArea.labelPoint.x,
          domain.realmArea.labelPoint.y - 15
        );
        ctx.fillText(
          domain.stats(),
          domain.realmArea.labelPoint.x,
          domain.realmArea.labelPoint.y + 15);
      }
    });
  };

  const drawProvinceInfo = (ctx) => {
    ctx.strokeStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const parameters = derivedZoomParameters();

    session.provinces.forEach((province) => {
      if (!province.descriptionArea) {
        return;
      }
      if (parameters.showName) {
        ctx.font = parameters.nameFont;
        ctx.fillText(
          province.name,
          province.descriptionArea.labelPoint.x,
          province.descriptionArea.labelPoint.y - 10
        );
      }

      if (parameters.showStats) {
        ctx.font = parameters.statsFont;
        ctx.fillText(
          province.stats(),
          province.descriptionArea.labelPoint.x,
          province.descriptionArea.labelPoint.y + 10
        );
      }
    });
  };

  const derivedZoomParameters = () => {
    const parameters = zoomParameters();

    return {
      showName: parameters.showName,
      showStats: parameters.showStats,
      nameFont: `bold ${parameters.nameFontSize}px calibri`,
      statsFont: `bold ${parameters.statsFontSize}px calibri`,
    };
  };

  const zoomParameters = () => {
    switch ($zoom) {
      case 1:
        return {
          showName: false,
          nameFontSize: 12,
          showStats: true,
          statsFontSize: 16,
        };
        break;
      case 2:
        return {
          showName: false,
          nameFontSize: 12,
          showStats: true,
          statsFontSize: 16,
        };
        break;
      case 3:
        return {
          showName: false,
          nameFontSize: 12,
          showStats: true,
          statsFontSize: 25,
        };
        break;
      case 4:
        return {
          showName: false,
          nameFontSize: 12,
          showStats: true,
          statsFontSize: 25,
        };
        break;
      case 5:
        return {
          showName: true,
          nameFontSize: 12,
          showStats: true,
          statesFontSize: 16,
        };
        break;
      case 6:
        return {
          showName: true,
          nameFontSize: 8,
          showStats: true,
          statsFontSize: 8,
        };
        break;
      case 7:
        return {
          showName: true,
          nameFontSize: 6,
          showStats: true,
          statsFontSize: 12,
        };
        break;
      case 8:
        return {
          showName: true,
          nameFontSize: 6,
          showStats: true,
          statsFontSize: 12,
        };
        break;
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
