<template>
  <v-row justify="center">
    <div v-if="this.previousModel">
      <v-btn @click="previous()" class="direction">précédent</v-btn>
    </div>
    <div v-for="cat in this.cat" :key="cat">
      <div class="item">
        <v-img
          min-height="70vh"
          max-height="70vh"
          class="image"
          :src="cat.path"
          @click="vote(cat)"
        ></v-img>
        <span class="caption">point: {{ cat.vote }}</span>
        <span class="caption">Nom du chat: {{ cat.name }}</span>
        <span class="caption">Description du chat: {{ cat.description }}</span>
      </div>
    </div>
    <div v-if="this.nextModel">
      <v-btn @click="next()" class="direction">suivant</v-btn>
    </div>
    <v-btn @click="addCat = true">Ajouter un chat</v-btn>
    <addCat v-if="addCat" @close="close" />
    <v-snackbar v-model="snackbar" :timeout="3000">{{ text }}</v-snackbar>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      addCat: false,
      previousModel: false,
      nextModel: false,
      snackbar: false,
      text: "",
      title: "Hello World!",
      url: "http://localhost:8000/api/file/",
      limit: 5,
      offset: 0,
      catNumber: 0,
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
    this.countCat();
    this.cat = [];
    this.getCats(this.offset, this.limit);
  },
  methods: {
    close(response) {
      this.addCat = false;
      if (response) {
        this.text = response;
        this.snackbar = true;
      }
    },
    next: function () {
      this.offset += this.limit;
      if (this.offset + this.limit > this.catNumber) {
        this.nextModel = false;
      }
      this.previousModel = true;
      this.getCats();
    },
    previous: function () {
      if (this.offset - this.limit >= 0) {
        this.offset -= this.limit;
      }
      if (this.offset === 0) {
        this.previousModel = false;
      }
      this.nextModel = true;
      this.getCats();
    },
    countCat: function () {
      this.$axios.get("/cat/count").then((response) => {
        this.catNumber = response.data;
        if (response.data > 5) {
          this.nextModel = true;
        }
      });
    },
    getCats: function (offset, limit) {
      const data = { offset, limit };
      this.$axios
        .get(`/cat/readLimit/${this.offset}/${this.limit}`, data)
        .then((response) => {
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
  },
};
</script>

<style lang="scss">
div.item {
  vertical-align: top;
  display: inline-block;
  text-align: center;
  width: 23vh;
  margin-right: 15px;
}
img {
  width: 50vh;
  height: 40vh;
  background-color: grey;
}
.caption {
  display: block;
}
.direction {
  margin-top: 25vh;
  margin-left: -10px;
  text-align: center;
}
</style>

