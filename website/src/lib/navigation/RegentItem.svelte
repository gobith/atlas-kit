<script lang="ts">
    export let object
</script>

<div >
    <div class="title">
      <h2>{object.name}</h2>
      <h3>{object.typeString()}</h3>
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
      text-align:end
    }
  </style>