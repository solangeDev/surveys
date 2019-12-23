<template>
  <div class="other-slider">
    <div class="slider-inputs-wrap">
      <el-slider
        show-input
        :id="option.option_text"
        :key="option.option_text"
        :ref="option.option_text"
        :name="option.option_text"
        :step="parseInt(option.parameters.breakpoints)"
        :min="parseInt(option.parameters.min)"
        :max="parseInt(option.parameters.max)"
        v-model="proxyValue"
        :show-input-controls="false"
        :disabled="submited || swapSlider(option.value)"
        v-validate="setJsonValidate(option.validation)"
      />
      <el-input
        type="text"
        id="input-range-value"
        v-money="moneyConfig"
        :disabled="submited"
        placeholder="Enter value here"
        v-model="inputNum"
        class="el-input-number el-input--small el-input-range"
        @change="setRange()"
      />
    </div>
    <span class="error-msj">{{errors.first(option.option_text)}}</span>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
import { VMoney } from "v-money";
export default {
  name: "Range",
  directives: {
    money: VMoney
  },
  data() {
    return {
      value: null,
      inputNum: "",
      moneyConfig: {
        decimal: ".",
        thousands: ",",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false /* doesn't work with directive */
      }
    };
  },
  watch: {
    value(newVale, oldValue) {
      this.inputNum = String(newVale);
      document.getElementById("input-range-value").value = String(newVale);
    }
  },
  mounted() {
    this.value = this.option.value;
    let smallInput = document.getElementsByClassName(
      "el-input el-input--small"
    );
    smallInput[0].style.display = "none";
  },
  updated() {
    this.value = this.option.value;
  },
  created() {
    this.value = this.option.value;
  },
  methods: {
    setRange() {
      let val = parseInt(this.inputNum.replace(/,/g, "").replace("$", ""));
      this.value = val;
    },
    ...mapActions(["addTag"]),
    swapSlider(input) {
      return this.option.parameters.max === input;
    },
    setJsonValidate(val) {
      if (Object.keys(val).indexOf("regex") !== -1) {
        return val;
      } else {
        const filtered = Object.keys(val).filter(key => {
          if (val[key]) {
            return key;
          }
        });
        return filtered.join("|");
      }
    }
  },
  computed: {
    ...mapGetters(["getNumPag"]),
    proxyValue: {
      get() {
        if (this.option.tag !== undefined) {
          let tag = this.option.tag.map(a => {
            let c = {
              tag: a.key,
              value: a.value_key !== undefined ? a.value_key : this.value
            };
            return c;
          });
          this.addTag(tag);
        }
        return this.value;
      },
      set(newValue) {
        if (this.option.tag !== undefined) {
          let tag = this.option.tag.map(a => {
            let c = {
              tag: a.key,
              value: a.value_key !== undefined ? a.value_key : newValue
            };
            return c;
          });
          this.addTag(tag);
        }
        this.value = newValue;
        this.$emit("input", newValue);
      }
    }
  },
  props: ["option", "submited", "questionType"]
};
</script>
<style lang="" scope>
.el-input-number .el-input__inner {
  text-align: center !important;
}
.el-input-range {
  position: relative;
  font-size: 14px;
  display: inline-block;
  top: -54px !important;
  left: 210px !important;
}
.el-input-number {
  width: 150px !important;
}
.el-input-number .el-input__inner {
  padding-left: 30px !important;
  padding-right: 30px !important;
}
</style>