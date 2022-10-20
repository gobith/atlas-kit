<script lang="ts">
  import { selection } from "../stores/world-state";

  import RegentItem from "./RegentItem.svelte";
  import DomainItem from "./DomainItem.svelte";
  import ProvinceItem from "./ProvinceItem.svelte";

  export let object;

  const component = {
    Regent: RegentItem,
    Realm: DomainItem,
    Domain: DomainItem,
    Province: ProvinceItem,
  }[object.typeString()];

  const clicked = () => {
    selection.set(object);
  };
</script>

<div class="card" class:active={$selection === object} on:click={clicked}>
  <svelte:component this={component} {object} />
</div>

<style>
  .card {
    position: relative;
    border-bottom: 1px solid rgba(151, 103, 56, 0.9);
    width: 260px;
    background-color: rgba(238, 235, 227, 0.9);
    cursor: pointer;
    height: 100%
  }

  .card:hover {
    background-color: rgba(151, 103, 56, 1);
  }

  .card::after {
    clear: both;
    display: block;
  }

  .active {
    background-color: rgba(151, 103, 56, 1);
  }
</style>
