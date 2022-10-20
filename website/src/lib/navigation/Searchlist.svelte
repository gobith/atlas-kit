<script lang="ts">

  import VirtualList from 'svelte-tiny-virtual-list';

  import ListItem from "./ListItem.svelte";

  import { resize , selection } from "../../stores/world-state";

  export let world;

  let data = world.namedEntities;
  let scrollIndex = 1;

  selection.subscribe((sel) => {
    scrollIndex = data.indexOf(sel)
  })



</script>

<div>

  <VirtualList
    width="280px"
    height={$resize.height - 20}
    itemCount={data.length}
    itemSize={94}
    scrollToIndex={scrollIndex}
    scrollToAlignment="auto">
    
  <div slot="item" let:index let:style {style}>
    <ListItem object={data[index]} />
  </div>
</VirtualList>



  <!-- <VirtualList items={} let:item>
    <ListItem object={item} />
  </VirtualList> -->
</div>

<style>
  div {
    position: absolute;
    top: 10px;
    left: 10px;
    height: calc(100vh - 20px); 
    border: 1px solid #cd853f; 
  }

  /* :global(svelte-virtual-list-viewport) {
    scrollbar-width: none;
  } */

  /* :global(::-webkit-scrollbar) {
    width: 0 !important;
  }  */
</style>
