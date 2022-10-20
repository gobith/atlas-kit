<script lang="ts">
  import {
    settings,
    zoomIn,
    zoomOut,
    scale,
    zoom,
    offset,
    cursor,
    selection,
    hoverSelection
  } from "../stores/world-state";

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleProvinces = () => {
    settings.update((settingsObject) => {
      return {
        ...settingsObject,
        showProvinces: !settingsObject.showProvinces,
      };
    });
  };

  const toggleProvinceInfo = () => {
    settings.update((settingsObject) => {
      return {
        ...settingsObject,
        showProvinceInfo: !settingsObject.showProvinceInfo,
      };
    });
  };

  const toggleRealms = () => {
    settings.update((settingsObject) => {
      return {
        ...settingsObject,
        showRealms: !settingsObject.showRealms,
      };
    });
  };

  const toggleRealmInfo = () => {
    settings.update((settingsObject) => {
      return {
        ...settingsObject,
        showRealmInfo: !settingsObject.showRealmInfo,
      };
    });
  };

  const toggleShadowBlur = () => {
    settings.update((settingsObject) => {
      return {
        ...settingsObject,
        shadowBlur: !settingsObject.shadowBlur,
      };
    });
  };

  $: worldCursor = { x: $cursor.x - $offset.x, y: $cursor.y - $offset.y };

  $: selName = selectionName();

  $: selectionName = () => {
    if ($selection) {
      return $selection.name;
    } else {
      return "none";
    }
  };

  $: hoverNameStr = hoverName()

  $: hoverName = () => {
    if ($hoverSelection) {
      return $hoverSelection.name;
    } else {
      return "none";
    }
  };

</script>

<div class="navigation">
  <div>
    <button on:click={zoomIn}>+</button>
    <button on:click={zoomOut}>-</button>
    <button on:click={toggleFullScreen}>#</button>
    <button on:click={toggleProvinces}>Provinces</button>
    <button on:click={toggleProvinceInfo}>Province info</button>
    <button on:click={toggleRealms}>Realms</button>
    <button on:click={toggleRealmInfo}>Realm info</button>
    <button on:click={toggleShadowBlur}>Shadow Blur</button>
  </div>
  <div>
    {$zoom} - {$scale} - offset: {$offset.x}@{$offset.y} - cursor: {$cursor.x}@{$cursor.y}
    world cursor: {worldCursor.x}@{worldCursor.y} selection: {selName} hover: {hoverNameStr}
  </div>
</div>

<style>
  .navigation {
    /* width: 700px; */
    position: absolute;
    left: 10px;
    right: 10px;
  }
</style>
