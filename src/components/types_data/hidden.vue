<template>
  <div style="display:none">
    <el-input
      clearable
      :id="option.option_text"
      :key="option.option_text"
      :ref="option.option_text"
      :disabled="submited"
      :type="option.type"
      :name="option.option_text"
      v-model="proxyValue"
    />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";

export default {
  name: "TextChoice",
  data() {
    return {
      response: {},
      value: null
    };
  },
  mounted() {
   let val = this.option.value;
   if(typeof this.option.value == "boolean"){
     val = val.toString();
   }
   this.value = val;
  },
  updated() {},
  created() {},
  methods: {},
  computed: {
    proxyValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.value = newValue;
        this.$emit("input", newValue);
      }
    }
  },
  props: ["option", "submited", "questionType"]
};
</script>



