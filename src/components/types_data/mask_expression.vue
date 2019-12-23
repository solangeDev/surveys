<template>
  <div>
    <el-row class="checkbox-row">
      <p>{{option.option_text}}</p>
      <el-col :span="24">
        <the-mask  clearable :mask="letter" :tokens="hexTokens" :id="option.option_text"
          :key="option.option_text"
          :ref="option.option_text"
          :disabled="submited" :type="option.type"
          :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
          :name="option.attributes.key_validate"
          @change="setResponse(option)"
          v-model="proxyValue"
          v-validate="setJsonValidate(option.validation)" class="el-input__inner" />
      </el-col>
      <span class="error-msj">{{errors.first(option.attributes.key_validate)}}</span>
    </el-row>
  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
import {TheMask} from 'vue-the-mask'

export default {
  name: "maskExpression",
  components: {TheMask},
  data() {
    return {
      response: {},
      value: null,
      letter:'',
      hexTokens: {}
    };
  },
  mounted() {
    this.value = this.option.value;
  },
  updated() {
    this.value = this.option.value;
  },
  created() {
    this.value = this.option.value;
    EventBus.$on("set-value", value => {
      value.forEach(element => {
        if (this.option.option_text == element.name) {
          this.$emit("input", element.value);
        }
      });
    });
     for (var i = 1; i < this.option.mask.maxlenght; i++) {
      this.letter+=this.option.mask.letter;
    }
    let obj1 = {};
    obj1.pattern = new RegExp(this.option.mask.expression)
    this.hexTokens[this.option.mask.letter] = obj1;
  },
  methods: {
    ...mapActions(["setError"]),
    setNameInput(val) {
      return val.replace(/\W/g, "_").toLowerCase();
    },
    setResponse(option) {
      if (this.value != null || this.val != "") {
        const value = this.value;
        this.response = { name: option.option_text, value: value };
        let arr = [];
        arr = [...arr, this.response];
        EventBus.$emit("set-value", arr);
      }
    },
    setJsonValidate(val) {
      const filtered = Object.keys(val).filter(key => {
        if (val[key]) {
          return key;
        }
      });
      return filtered.join("|");
    }
  },
  computed: {
    ...mapGetters(["getNumPag"]),
    questionKey() {
      this.getNumPag;
    },
    proxyValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        if (newValue != null) {
          this.setError({ status: false, msj: "" });
        }
        this.value = newValue;
        this.$emit("input", newValue);
      }
    }
  },
  props: ["option", "submited"]
};
</script>


