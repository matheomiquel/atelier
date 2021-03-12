<template>
  <v-row justify="center">
    
    <div v-for="cat in this.cat" :key="cat">
      <div class="item">
        <v-img min-height="70vh" max-height="70vh" class="image" :src="cat.path" @click="vote(cat)"></v-img>
        <span class="caption">Point du chat: {{ cat.vote }}</span>
        <span class="caption">Nom du chat: {{ cat.name }}</span>
        <span class="caption">Description du chat: {{ cat.description }}</span>
      </div>
    </div>
    <v-snackbar v-model="snackbar" :timeout="3000">{{ text }}</v-snackbar>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      text: "",
      title: "Hello World!",
      url: "http://localhost:8000/api/file/",
      cat: [
        {
          path: "",
          id: 0,
          name: "",
          description: "",
          vote: 0,
        },
      ],
    };
  },
  mounted: function () {
    this.getCats();
  },
  methods: {
    getCats: function () {
      this.$axios.get(`/cat/twoCats`).then((response) => {
        this.cat = [];
        response.data.map((cat, index) => {
          const data = {
            path: `${this.url}${cat.id}`,
            id: cat.id,
            name: cat.name,
            description: cat.description,
            vote: cat.vote,
          };
          this.cat.push(data);
        });
      });
    },
    vote: function (cat) {
      this.cat = [];
      this.$axios
        .put(`/cat/vote/${cat.id}`)
        .then((res) => {
          this.text = `Vous avez voté pour ${cat.name}`;
          this.snackbar = true;
        })
        .catch((err) => {
          this.text = err.response.data;
          this.snackbar = true;
        });
      this.getCats();
    },
  },
};
</script>

<style lang="scss">
div.item {
  vertical-align: top;
  display: inline-block;
  text-align: center;
  width: 70vh;
}
img {
  width: 50vh;
  height: 40vh;
  background-color: grey;
}
.caption {
  display: block;
}
</style>

