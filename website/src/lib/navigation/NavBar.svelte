<script lang="ts">
  const activateItem = (event) => {

    const anchors = document.getElementsByClassName("anchor");

    for (var i = 0; i < anchors.length; i++) {
  
      anchors[i].classList.remove("active");
    }

    event.target.classList.add("active");
  };
</script>

<ul>
  <li on:click={activateItem}><a class="anchor active" href="#/map">Map</a></li>
  <li on:click={activateItem}>
    <a class="anchor" href="#/provinces">Provinces</a>
  </li>
  <li on:click={activateItem}>
    <a class="anchor" href="#/holdings">Holdings</a>
  </li>
  <li on:click={activateItem}>
    <a class="anchor" href="#/regents">Regents</a>
  </li>
</ul>

<style>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 40px;
    background-color: rgba(26, 24, 26, 0.8);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }

  li {
    float: left;
  }

  li a {
    display: block;
    color: white;
    text-align: center;
    padding: 10px 16px;
    text-decoration: none;
  }

  li a:hover {
    background-color: #111;
  }

  .active {
    background-color: #04aa6d;
  }
</style>
