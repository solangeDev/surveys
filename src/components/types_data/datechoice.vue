<template>
  <div>
    <el-row class="checkbox-row">
      <p>{{option.option_text}}</p>
      <el-col :span="24">
        <el-date-picker
          clearable
          format="yyyy/MM/dd"
          :disabled="submited"
          :name="option.attributes.key_validate"
          :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
          :picker-options="filterDate"
          @change="setResponse(option)"
          type="date"
          v-model="proxyValue"
          v-validate="setJsonValidate(option.validation)"
          :id="option.option_text"
          :key="option.option_text"
          :ref="option.option_text"
          :editable="false"
        />
      </el-col>
      <span class="error-msj">{{errors.first(option.attributes.key_validate)}}</span>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
import moment from "moment";

export default {
  name: "inputDate",
  data() {
    return {
      response: {},
      value: null,
      filterDate: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getFullYear() < 1900;
        }
      }
    };
  },
  created() {},
  updated() {
    let dateVal = this.option.value;
    if (this.option.value != "" && this.option.value != null) {
      this.value = this.setFormatData("lll", dateVal);
    }
  },
  mounted() {
    let dateVal = this.option.value;
    if (this.option.value != "" && this.option.value != null) {
      this.value = this.setFormatData("lll", dateVal);
    }
  },
  methods: {
    ...mapActions(["addResponse", "removeResponse", "actTags"]),
    setNameInput(val) {
      return val.replace(/\W/g, "_").toLowerCase();
    },
    setJsonValidate(val) {
      if (val != null) {
        const filtered = Object.keys(val).filter(key => {
          if (val[key]) {
            return key;
          }
        });
        return filtered.join("|");
      }
    },
    async setResponse(option) {
      const value = this.value;
      if (value != null) {
        this.response = {
          name: option.option_text,
          value: this.setFormatData("YYYY-MM-DD", value)
        };
        let arr = [];
        arr = [...arr, this.response];
        await EventBus.$emit("set-value", arr);
        if (option.key_tag !== undefined) {
          if(option.key_tag == "{{DOB}}"){
            let age = moment().diff(moment(this.setFormatData("YYYY-MM-DD", value), "YYYY-MM-DD"), 'years', false);
            let tag = { tag: "{{AGE}}", value: age };
            this.actTags(tag);
          }
        }
      }
    },
    getFormatData(format, value) {
      var moment = require("moment-timezone");
      return moment.tz(value, value, format, moment.tz.guess()).format(format);
    },
    setFormatData(format, value) {
      return moment(value).format(format);
    }
  },
  computed: {
    proxyValue: {
      get() {
        if (this.option.value != "" && this.option.value != null) {
          this.value = this.setFormatData("lll", this.option.value);
        }
        return this.value;
      },
      set(newValue) {
        if (newValue !== null) {
          newValue = this.getFormatData("lll", newValue);
        } else {
          this.value = newValue;
        }
        this.$emit("input", newValue);
      }
    }
  },
  props: ["option", "submited"]
};
</script>
