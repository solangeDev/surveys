<template>
  <div>
    <template>
      <el-row class="checkbox-row" :class="{'padding-modal':modal}">
        <p>{{option.option_text}}</p>
        <el-col :span="24">
          <el-input
            clearable
            :id="option.option_text"
            :key="option.option_text"
            :ref="option.option_text"
            :disabled="submited"
            :type="option.type"
            :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
            :name="option.attributes.key_validate"
            @change="setResponse(option)"
            v-model="proxyValue"
            :maxlength="(option.attributes.maxlength)?option.attributes.maxlength:null"
            v-validate="setJsonValidate(option.validation)"
            :readonly="(option.attributes.readonly)?option.attributes.readonly:false"
          />
        </el-col>
      </el-row>
      <span v-if="showValidate()" class="error-msj">{{errors.first(option.attributes.key_validate)}}</span>
    </template>
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
    ...mapActions(["addTag", "setError"]),
    showValidate() {
      let valid = true;
      if (
        this.section.is_poa !== undefined &&
        this.section.is_poa == true &&
        this.section.type == "static-form"
      ) {
        valid = false;
      }
      return valid;
    },
    setNameInput(val) {
      return val.replace(/\W/g, "_").toLowerCase();
    },
    async setResponse(option) {
      let value = this.value;
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
        if (newValue != null) {
          this.setError({ status: false, msj: "" });
        }
        this.value = newValue;
        this.$emit("input", newValue);
      }
    }
  },
  props: ["option", "submited", "questionType", "section", "modal"]
};
</script>


