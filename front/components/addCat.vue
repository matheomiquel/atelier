<template>
  <v-dialog v-model="dialog" scrollable max-width="300px">
    <v-card>
      <v-card-title>Select Country</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-text-field
          v-model="name"
          color="purple darken-2"
          label="Nom du chat"
          required
        ></v-text-field>
        <v-text-field
          v-model="description"
          color="purple darken-2"
          label="Description du chat"
          required
        ></v-text-field>
        <v-file-input v-on:change="getFile" label="chat"></v-file-input>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="close"> Fermer </v-btn>
        <v-btn color="blue darken-1" text @click="addCat()">
          Ajouter le chat
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="3000">{{ text }}</v-snackbar>
  </v-dialog>
</template>

<script>
import FormData from "form-data";
import fs from "fs";
export default {
  props: {
    close: Boolean,
  },
  data() {
    return {
      snackbar: false,
      text: "",
      name: "",
      description: "",
      file: {},
      dialogm1: true,
      dialog: true,
    };
  },
  methods: {
    getFile: function (image) {
      this.file = image;
    },
    close: function () {
      this.$emit("close", undefined);
    },
    addCat: function () {
      const bodyFormData = new FormData();
      bodyFormData.append("name", this.name);
      bodyFormData.append("description", this.description);
      bodyFormData.append("avatar", this.file);
      this.$axios
        .post("/cat/create", bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          this.$emit("close", response.data);
        })
        .catch((err) => {
          this.text = err.response.data;
          this.snackbar = true;
        });
    },
  },
};
</script>