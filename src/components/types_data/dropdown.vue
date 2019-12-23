<template>
  <div>
    <el-row class="checkbox-row" :class="{'padding-modal':modal}">
      <p>{{option.option_text}}</p>
      <el-col :span="24" class="address">
        <template
          v-if="option.attributes.multiple !== undefined && option.attributes.multiple === true"
        >
          <v-select
            multiple
            :ref="'select_'+option.key_name"
            :id="'select_'+option.key_name"
            :name="option.attributes.key_validate"
            v-validate="setJsonValidate(option.validation)"
            :disabled="disabled"
            :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
            v-model="proxyValue"
            :options="dataAutocomplete.data"
            :reduce="option => option.value"
            label="text"
            class="style-chooser"
          ></v-select>
        </template>
        <template v-else>
          <v-select
            :ref="'select_'+option.key_name"
            :id="'select_'+option.key_name"
            :name="option.attributes.key_validate"
            v-validate="setJsonValidate(option.validation)"
            :disabled="disabled"
            :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
            v-model="proxyValue"
            :options="dataAutocomplete.data"
            :reduce="option => option.value"
            label="text"
          ></v-select>
        </template>
      </el-col>
      <span class="error-msj">{{errors.first(option.attributes.key_validate)}}</span>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import EventBus from "../../bus";

export default {
  name: "Dropdown",
  components: {
    "v-select": vSelect
  },
  data() {
    return {
      dropdownDisplay: null,
      arrMarital: [
        "married",
        "common-law",
        "single",
        "divorced",
        "widowed",
        "separated"
      ],
      optionsHidden: ["SP", "CL"],
      optionsValue: [],
      dataAutocomplete: {
        data: {},
        selected: null
      },
      test:null,
      disabled: true
    };
  },
  created() {
    this.filterOptions();
  },
  mounted() {
    this.dropdownDisplay = this.option.value;
    this.disabled = this.submited;
    if (this.option.attributes.readonly !== undefined) {
      this.disabled = true;
    }
  },
  methods: {
    async filterOptions() {
      const filter_marital = this.option.filter_marital;
      if (this.option.optionsFront == undefined && this.option.options.length > 0) {
        this.dataAutocomplete.data = this.option.options;
      } else {
        this.dataAutocomplete.data = this.option.optionsFront;
      }
      //filter marital options
      if (filter_marital !== undefined && filter_marital === true) {
        let marital = this.getvariablesTag.filter(i => {
          if (i.tag == "{{marital_status}}") {
            return i;
          }
        });
        if (
          marital.length > 0 &&
          this.arrMarital.indexOf(marital[0].value) != -1
        ) {
          const optionsDrop = this.dataAutocomplete.data.filter(a => {
            if (this.optionsHidden.indexOf(a.value) == -1) {
              return a;
            }
          });
          this.dataAutocomplete.data = optionsDrop;
        }
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
    ...mapGetters(["getvariablesTag"]),
    proxyValue: {
      get() {
        if (this.option.value !== null && this.option.value !== "") {
          this.dataAutocomplete.selected = this.option.value;
          this.test = this.dataAutocomplete.selected
        }
        return this.dataAutocomplete.selected;
      },
      set(newValue) {
        this.dataAutocomplete.selected = newValue;
        this.test = this.dataAutocomplete.selected
        this.$emit("input", newValue);
      }
    }
  },
  props: ["option", "submited", "index", "section", "modal"]
};
</script>

<style lang="" scope>
.vs__dropdown-menu {
  max-height: 180px;
}
.vs__dropdown-toggle {
  padding: 0 0 8px;
}
.vs__search::placeholder {
  color: #c2c5ca;
}

.style-chooser .vs__selected {
  background-color: #f0f0f0;
  border: 1px solid rgba(60, 60, 60, 0.26);
  border-radius: 4px;
  color: #333;
  line-height: 1.4;
  margin: 4px 2px 0;
  width: 100% !important;
  text-align: left;
  padding: 5px;
}
.style-chooser .vs__deselect {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: 0;
  cursor: pointer;
  background: none;
  fill: rgba(60, 60, 60, 0.5);
  text-shadow: 0 1px 0 #fff;
  position: absolute;
  right: 10px;
}
.style-chooser .vs__actions {
  display: none !important;
}
.style-chooser .vs__dropdown-menu{
  position: static !important;
}
</style>