<template>
  <div class="home-page">
    <section>
      <img
        src="../assets/vue.svg"
        alt="Vue"
        width="104"
      >
      <h1>{{ greeting }}</h1>

      <router-link to="/about">
        About
      </router-link>
    </section>
  </div>
</template>

<script>
export default {
  setup() {
    return {
      greeting: 'Hello Vue223323weweew!'
    };
  }
}
</script>

<style>
  h1 {
    font-size: 2em;
    color: #42b983;
    text-align: center;
  }

  img {
    height: 100px;
    width: auto;
    margin: 0 auto;
    display: block;
  }
</style>
