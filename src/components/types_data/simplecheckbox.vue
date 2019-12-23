<template>
  <div>
    <el-row class="checkbox-row">
      <el-col :span="24" class="phone">
        <input
          type="checkbox"
          :name="option.option_text"
          :ref="option.option_text"
          :id="getId(option)"
          :disabled="submited"
          @change="toggleChoice(option)"
          v-model="valueChoice"
          class="primary-radio"
          v-validate="setJsonValidate(option.validation)"
        >
        <label class="primary-checkbox">{{option.option_text}}</label>
        <span class="error-msj">{{errors.first(option.option_text)}}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";

export default {
  name: "simpleCheckbox",
  data() {
    return {
      valueChoice: null
    };
  },
  updated() {},
  mounted() {
    if (this.option.value === true) {
      this.valueChoice = true;
    }
  },
  methods: {
    getId(option){
      let val = `label_${option.key_name}`;
      if(option.valueBack !== undefined){
        val += `_${option.valueBack.toLowerCase()}`;
      }
      return val
    },
    ...mapActions(["setSingleChoice"]),
    toggleChoice(option) {
      let obj = {};
      obj.val = option.valueBack;
      obj.key_name = option.key_name;
      if (this.valueChoice) {
        obj.value = true;
      } else {
        obj.value = option.valueBack;
      }
      this.setSingleChoice(obj);
      if (option.readonly) {
        this.section.question_options.map(a => {
          const readonly = option.readonly.key_name;
          if (a.type == "simple-checkbox") {
            if (readonly.indexOf(a.valueBack) !== -1) {
              let obj1 = {};            
              let id = `label_${a.key_name}`;
              if(a.valueBack !== undefined){
                id += `_${a.valueBack.toLowerCase()}`;
              }
              obj1.val = a.valueBack;
              obj1.key_name = a.key_name;
              this.setSingleChoice(obj1);
              document.getElementById(id).checked = false;
            }
          }
        });
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
    ...mapGetters(["getNumPag", "getPagAct"])
  },
  props: ["option", "submited", "error", "section"]
};
</script>
