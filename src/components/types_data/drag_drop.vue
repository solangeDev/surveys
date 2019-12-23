<template>
  <div>
    <draggable v-model="myArray" group="people" @start="drag=true" @end="log">
      <el-card class="drag-card" v-for="option in this.option.optionsFront" :key="option.id">
        {{(typeof option.value == "object")?option.value.value:option.value}}
        <i
          class="el-icon-rank"
        />
      </el-card>
    </draggable>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
import draggable from "vuedraggable";

export default {
  name: "Dragdrop",
  components: {
    draggable
  },
  data() {
    return {
      myArray: null,
      activeNames: null
    };
  },
  mounted() {
    this.myArray = this.option.optionsFront.map(c => {
      let b = { ...c };
      if (typeof b.value == "object") {
        b.value = b.value.value;
      }
      return b;
    });
  },
  updated() {},
  created() {},
  methods: {
    ...mapActions(["setOptionsDrag"]),
    log() {
      this.setOptionsDrag(this.myArray);
    }
  },
  computed: {},
  props: ["option", "submited", "questionType"]
};
</script>