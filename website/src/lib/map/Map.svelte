<script lang="ts">
  import {
    resetResize,
    attachResizeEvent,
    detachResizeEvent,
  } from "../stores/world-state";

  import { onMount, onDestroy } from "svelte";

  import Background from "./Background.svelte";
  import Descriptions from "./Descriptions.svelte";
  import Hover from "./Hover.svelte";
  import Province from "./Province.svelte";

  export let session;

  onMount(() => {
    attachResizeEvent();
    resetResize();
  });

  onDestroy(() => {
    detachResizeEvent();
  });
</script>

<Background {session} />
<Descriptions {session} />
<Hover {session} />
<Province/>

<style>
</style>
