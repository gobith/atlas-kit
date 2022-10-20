<script lang="ts">
  import { selection } from "../stores/world-state";

  export let object;

  const selectRegent = () => {
    selection.set(object.regent());
  };
</script>

<div>
  <div class="title">
    <h2>{object.name}</h2>
    <h3>{object.typeString()}</h3>
    <div />
    <button on:click={selectRegent}>Regent</button>
  </div>
</div>

<style>
  .title {
    padding: 14px;
    display: grid;
    grid-template-columns: 4fr 1fr;
  }
  h2 {
    margin: 0 0 0.5em 0;
    font-size: 16px;
  }
  h3 {
    margin: 0 0 0.5em 0;
    font-size: 8px;
    text-transform: uppercase;
    text-align: end;
  }
</style>
