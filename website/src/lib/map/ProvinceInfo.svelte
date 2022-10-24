<script lang="ts">
  import type { Province } from '$lib/domain/domain';
  export let province: Province;
</script>

<div class="container">


  <table>
    <tr>
      <th rowspan="4" />
      <th colspan="4">{province.owner ? province.owner.name : 'No Owner'}</th>
    </tr>
    <tr>
      <th colspan="4">{province.name}</th>
    </tr>
    <tr>
      <th colspan="2"
        ><small>lvl</small>
        <p>{province.level}</p></th
      >
      <th colspan="2"
        ><small>src</small>
        <p>{province.sourceRating}</p></th
      >
    </tr>

    <tr>
      <th>L</th>
      <th>T</th>
      <th>G</th>
      <th>S</th>
    </tr>

    {#each province.domainHoldings() as domainHolding}
      <tr>
        <td>{domainHolding.owner.name}</td>
        <td>{domainHolding.law}</td>
        <td>{domainHolding.temple}</td>
        <td>{domainHolding.guild}</td>
        <td>{domainHolding.source}</td>
      </tr>
    {/each}
  </table>
</div>

<style>
  .container {
    display: grid;
    margin: 10px;
  }

  table,
  th,
  td {
    border: 1px solid black;
    padding: 4px;
  }

  table {
    border-collapse: collapse;
  }

  p {
    margin: 0px;
  }
</style>
