<template>
  <div v-if="info" class="propertyContent">
    <p>
      <span>ID: </span>
      <router-link :to="`${info.id}`">{{ info.id }}</router-link>
    </p>
    <p>
      <span>Children: </span>
      <span v-if="info.children.length">
        <span v-for="id in info.children" :key="id">
          <router-link :to="`${id}`">{{ id }}</router-link>
        </span>
      </span>
      <span v-else>NONE</span>
    </p>
    <p>
      <span>Parent: </span>
      <router-link v-if="info.parent !== undefined" :to="`${info.parent}`">{{
        info.parent
      }}</router-link>
      <span v-else>NONE</span>
    </p>
    <hr />
    <p>
      <span>Name: </span
      ><input type="text" v-model.trim="info.properties.name" maxlength="10" />
    </p>
    <p>
      <span>Type: {{ info.properties.type }}</span>
    </p>
    <hr />
    <div>
      <p><span>Center: </span></p>
      <p v-for="prop in ['x', 'y', 'z']" :key="prop">
        <span data-type="center" class="coordValues"
          >{{ initialUpper(prop) }}:
        </span>
        <input type="number" v-model.number="info.properties.center[prop]" />
      </p>
    </div>
    <hr />
    <p v-for="(property, index) in coordValues" :key="index">
      <span class="coordValues">{{ initialUpper(property) }}: </span>
      <input type="number" v-model.number="info.properties[property]" />
    </p>
  </div>
</template>

<script>
export default {
  name: "propertyContent",
  data() {
    window.a = this.$store.state.directory;
    return {
      info: this.$store.state.directory[this.$route.params.id]
    };
  },
  computed: {
    coordValues() {
      if (this.info) {
        /* eslint-disable-next-line */
        const { name, type, center, ...res } = this.info.properties;

        return Object.keys(res);
      }
      return [];
    }
  },
  methods: {
    initialUpper(word) {
      return word[0].toUpperCase() + word.slice(1);
    }
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(newVal) {
        this.info = this.$store.state.directory[newVal];
      }
    },
    "$store.state.directory": {
      handler(newVal) {
        this.info = newVal[this.$route.params.id];
      }
    }
  }
};
</script>

<style scoped>
.propertyContent {
  height: 100%;
  color: white;
  padding: 10px 20px;
}

.propertyContent > p {
  margin: 10px 0;
}

.propertyContent > hr {
  margin: 20px 0;
}

.propertyContent a {
  display: inline-block;
  text-decoration: none;
  width: 20px;
  height: 20px;
}

.propertyContent input {
  width: 60%;
  padding: 2px 3px;
}

.coordValues {
  display: inline-block;
  width: 30%;
}

.coordValues[data-type="center"] {
  width: 20%;
  margin: 5px 0;
}
</style>
