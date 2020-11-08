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
      ><input type="text" v-model.trim="info.name" maxlength="10" />
    </p>
    <p>
      <span>Type: {{ info.type }}</span>
    </p>
    <hr />
    <div>
      <p><span>Center: </span></p>
      <p v-for="prop in ['x', 'y', 'z']" :key="'Center ' + prop">
        <span data-type="center" class="keyNames"
          >{{ initialUpper(prop) }}:</span
        >
        <input type="number" v-model.number="info.center[prop]" />
      </p>
    </div>
    <hr />
    <p v-for="(property, index) in numTypeKeys" :key="property + index">
      <span class="keyNames">{{ initialUpper(property) }}: </span>
      <input type="number" v-model.number="info[property]" />
    </p>
    <!-- <hr/> -->
    <div v-for="(property, index) in objTypeKeys" :key="property + index">
      <p>
        <span>{{ initialUpper(property) }}: </span>
      </p>
      <p
        v-for="(prop, index2) in Object.keys(info[property])"
        :key="prop + index2"
      >
        <span class="keyNames">{{ initialUpper(prop) }}: </span>
        <input type="number" v-model.number="info[property][prop]" />
      </p>
    </div>
    <!-- <hr/> -->
    <div v-for="(property, index) in arrTypeKeys" :key="property + index">
      <div v-if="typeof info[property][0] === 'object'">
        <span class="keyNames">{{ initialUpper(property) }}: </span>
        <div
          v-for="(arr, index2) in info[property]"
          :key="`array${index2}`"
          class="inputContainer"
          :data-type="!((index2 + 1) % 4) ? 'cutLine' : ''"
        >
          <input
            v-for="(value, index3) in arr"
            type="number"
            v-model.number="arr[index3]"
            :key="'Value ' + index3"
          />
        </div>
      </div>
      <div v-else>
        <span class="keyNames">{{ initialUpper(property) }}: </span>
        <div class="inputContainer">
          <input
            v-for="(value, index2) in info[property]"
            type="number"
            v-model.number="info[property][index2]"
            :key="'Value ' + index2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "propertyContent",
  setup() {
    const router = useRouter();
    const store = useStore();
    const info = ref(null);
    const numTypeKeys = ref([]);
    const arrTypeKeys = ref([]);
    const objTypeKeys = ref([]);

    watchEffect(() => {
      const route = router.currentRoute.value;
      info.value = store.state.directory[route.params.id];

      if (info.value) {
        const { name, type, center, ...res } = info.value;

        Object.keys(res).map((key) => {
          let type = Object.prototype.toString.call(res[key]).slice(8, -1);
          if (type === "Array") {
            arrTypeKeys.value.push(key);
          } else if (type === "Object") {
            objTypeKeys.value.push(key);
          } else if (type === "Number") {
            numTypeKeys.value.push(key);
          }
        });
      }
    });

    return {
      info,
      numTypeKeys,
      arrTypeKeys,
      objTypeKeys,
      initialUpper,
    };

    function initialUpper(word) {
      return word[0].toUpperCase() + word.slice(1);
    }
  },
});
</script>

<style scoped>
.propertyContent {
  height: calc(100% - 20px);
  color: white;
  padding: 10px 20px;
  overflow: scroll;
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

.keyNames {
  display: inline-block;
  width: 30%;
}

.keyNames[data-type="center"] {
  width: 20%;
  margin: 5px 0;
}
input {
  margin-left: 10px;
}
.inputContainer input:nth-child(3n + 1) {
  margin-left: 0;
}
.inputContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0;
}
.inputContainer[data-type="cutLine"] {
  padding-bottom: 10px;
  border-bottom: solid 1px white;
  margin-bottom: 10px;
}
</style>
