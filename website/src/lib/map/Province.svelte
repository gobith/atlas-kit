<script lang="ts">
  import { hoverSelection, selection , cursor } from "../stores/world-state";
  import ProvinceInfo from "./ProvinceInfo.svelte";

  let top = 0;
  let left = 0;
  let province;

  hoverSelection.subscribe((provinceOrNull) => {

    if ($selection) {return};
    province = provinceOrNull;

    // top = $cursor.y;
    // left = $cursor.x;
    top = 70;
    left = 10
  });


  selection.subscribe((selectedProvince) => {
    province = selectedProvince;

    // top = $cursor.y;
    // left = $cursor.x;
    top = 70;
    left = 10
  });

</script>

<div class:active={province} style="--top:{top};--left:{left}">
  {#if province}
    <ProvinceInfo {province} />
  {/if}
</div>

<style>
  div {
    position: absolute;
    display: none;
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    color: black;
    /* background-color: rgba(0, 0, 0, 0.8); */
    background-color: rgb(252, 245, 229);
    text-align: center;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  }

  .active {
    display: block;
  }
</style>
