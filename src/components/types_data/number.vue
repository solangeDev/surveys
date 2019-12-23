<template>
  <div>
      <el-row class="checkbox-row">
        <p>{{option.option_text}}</p>
        <el-col :span="24">
          <div v-if="option.attributes.mask">
            <input
              @keypress="disableKeycode($event)"
              clearable
              :min="(option.attributes.min)?option.attributes.min:0"
              :id="option.option_text"
              :key="option.option_text"
              :ref="option.option_text"
              :disabled="submited"
              type="text"
              :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
              :name="option.attributes.key_validate"
              @change="setResponse(option)"
              v-model="proxyValue"
              v-validate="setJsonValidate(option.validation)"
              v-mask="option.attributes.mask"
              class="el-input__inner"
              @keyup="keyHandler($event)"
            />
          </div>
          <div v-else>
             <input
              @keypress="disableKeycode($event)"
              clearable
              :min="(option.attributes.min)?option.attributes.min:0"
              :id="option.option_text"
              :key="option.option_text"
              :ref="option.option_text"
              :disabled="submited"
              type="text"
              :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
              :name="option.attributes.key_validate"
              @change="setResponse(option)"
              v-model="proxyValue"
              v-validate="setJsonValidate(option.validation)"
              class="el-input__inner"
              @keyup="keyHandler($event)"
            />
          </div>
          
        </el-col>
      </el-row>
      <span class="error-msj">{{errors.first(option.attributes.key_validate)}}</span>
  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
import { mask } from "vue-the-mask";

export default {
  name: "inputNum",
  directives: {
    mask
  },
  data() {
    return {
      response: {},
      value: null
    };
  },
  mounted() {
    this.value = this.option.value;
    if (
      this.option.tag_text !== undefined &&
      this.option.tag_text.key == "{{SPOUSE_FIRST_NAME}}" &&
      (this.value != null || this.value != "")
    ) {
      let tag = [{ tag: this.option.tag_text.key, value: this.value }];
      this.addTag(tag);
    }
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
  },
  methods: {
    keyHandler(evt){
    if(this.value !== null){
      let value = evt.target.value.replace("-","");
      value = value.replace("+","");
      if(this.option.attributes.min != 0){
        evt.target.value = value.replace(/^0+/, ''); 
      }   
    }
    },
    disableKeycode(evt){
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode == 45 || charCode == 43) {
        evt.preventDefault();;
      } else {
        return true;
      }
    },
    ...mapActions(["addTag"]),
    setNameInput(val) {
      return val.replace(/\W/g, "_").toLowerCase();
    },
    async setResponse(option) {
      let value = this.value.replace("-","").replace("+","").replace(/^0+/, ''); 
      this.response = { name: option.option_text, value: value };
      let arr = [];
      arr = [...arr, this.response];
      await EventBus.$emit("set-value", arr);
      if (option.tag_text !== undefined) {
        let tag = [{ tag: option.tag_text.key, value: value }];
        this.addTag(tag);
      }
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
    questionKey() {
      this.getNumPag;
    },
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
  props: ["option", "submited", "questionType", "section"]
};
</script>


