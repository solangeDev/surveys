<template>
  <div>
    <el-row class="checkbox-row">
      <p>{{option.option_text}}</p>
      <el-col :span="24" class="address">
        <gmap-autocomplete
          :name="option.attributes.key_validate"
          :id="option.key_name"
          v-validate="setJsonValidate(option.validation)"
          ref="mapAutoComplete"
          class="mapInput"
          :disabled="submited"
          :selectFirstOnEnter="true"
          :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
          v-model="mapData.address1"
          @place_changed="setPlace"
          @keyup.enter="setPlace"
        ></gmap-autocomplete>
      </el-col>
      <span class="error-msj">{{errors.first(option.attributes.key_validate)}}</span>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
export default {
  name: "inputAddress",
  updated() {},
  mounted() {
    //preload data from Searcher Map
    if (this.option.valueSource) {
      this.setPlace(this.option.valueSource);
    }
  },
  data() {
    return {
      response: {},
      place: null,
      mapData: {
        address1: null,
        address2: null,
        city: null,
        postal: null,
        country: null,
        province: null,
        province_short: null,
        place_id: null
      }
    };
  },
  created() {
    this.mapData.address1 = this.option.value;
  },
  methods: {
    ...mapActions(["setPagSurvey"]),
    filterOptions(keyname) {
      const value = this.section.question_options.filter(a => {
        if (a.key_name == keyname) {
          return a;
        }
      });
      return value;
    },
    setPlace(place) {
      if (this.mapData) {
        this.mapData = {
          address1: null,
          address2: null,
          city: null,
          postal: null,
          country: null,
          province: null,
          province_short: null,
          place_id: null
        };
      }
      this.place = place;
      let cat = this.mapData;
      cat.address1 = place.name;
      // reverse order of array so sublocality (higher precision)
      // overrides locality (lower precision)
      let reverseOrder = place.address_components;
      reverseOrder.forEach(component => {
        const type = component.types;
        const name = component.long_name;
        const short = component.short_name;
        if (type.includes("country")) cat.country = name;
        else if (type.includes("administrative_area_level_1")) {
          cat.province = name;
          cat.province_short = short;
        } else if (
          type.includes("postal_code") ||
          type.includes("postal_code_prefix")
        )
          cat.postal = name;
        else if (type.includes("locality") && type.includes("political"))
          cat.city = name;
        else if (type.includes("locality") && type.includes("political"))
          cat.city = name;
      });
      this.mapData.place_id = place.place_id;
      if (this.mapData.province_short.length > 2) {
        const country = reverseOrder.map(c => {
          if (this.mapData.country == c.long_name) {
            this.mapData.province_short = c.short_name;
          }
        });
      }
      //preload data input address
      if (this.mapData) {
        const values = [];
        const obj = {};
        obj.name = this.option.option_text;
        obj.value = this.mapData.address1;
        obj.source = this.place;
        values.push(obj);
        const inputFill = this.option.inputFilled;
        const provinceCode = this.mapData.province_short;
        const arrVal = inputFill.map(c => {
          let val_key = null;
          let adreess_old = this.filterOptions("address_line_1");
          if (
            c.key_name == "city" ||
            c.key_name == "country" ||
            c.key_name == "province"
          ) {
            val_key = this.filterOptions(c.key_name);
            if (
              val_key[0].value == null ||
              this.mapData.address1 != adreess_old[0].value
            ) {
              let val = {};
              val.name = c.option_text;
              val.value = this.mapData[c.key_name];
              values.push(val);
            }
          }
          if (c.key_name == "postal_code") {
            val_key = this.filterOptions(c.key_name);
            if (
              val_key[0].value == null ||
              this.mapData.address1 != adreess_old[0].value
            ) {
              let val = {};
              val.name = c.option_text;
              val.value = this.mapData.postal;
              values.push(val);
            }
          }
          if (c.key_name == "cod_province") {
            let val = {};
            val.name = c.option_text;
            val.value = provinceCode;
            values.push(val);
          }
          if (c.key_name == "address_line_2") {
            if (this.mapData.address1 != adreess_old[0].value) {
              let val = {};
              val.name = c.option_text;
              val.value = null;
              values.push(val);
            }
          }
        });
        if (values.length > 0) {
          this.setPagSurvey(values);
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
    ...mapGetters(["getPagAct"])
  },
  props: ["option", "submited", "index", "section"]
};
</script>



