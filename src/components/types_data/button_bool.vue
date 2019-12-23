<template>
  <div>
    <el-row class="checkbox-row">
      <div class="display-flex">
        <div class="flex-direction header-text">
          <h4>{{option.option_text}}</h4>
        </div>
        <div class="flex-direction">
          <div class="display-flex">
            <div class="flex-direction p10">
              <button
                @click="toggleButton(true)"
                :class="{'button-selected-bool':checked,'is-disabled':submited}"
                :ref="'yes_option_'+this.index"
                :disabled="submited"
                :id="'yes_option_'+this.index"
                class="el-button el-button--info btn-comp-bool mt"
              >Yes</button>
            </div>
            <div class="flex-direction p10">
              <button
                @click="toggleButton(false)"
                :class="{'button-selected-bool':checked,'is-disabled':submited}"
                :disabled="submited"
                :ref="'no_option_'+this.index"
                :id="'no_option_'+this.index"
                class="el-button el-button--info btn-comp-bool mt"
              >No</button>
            </div>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
export default {
  data() {
    return {
      checked: false,
      value: null
    };
  },
  mounted() {
    if (this.option.value == "true") {
      var element = document.getElementById("yes_option_" + this.index);
      element.classList.add("button-selected-bool");
      var element2 = document.getElementById("no_option_" + this.index);
      element2.classList.remove("button-selected-bool");
      this.value = "true";
      this.setTag(this.option);
    } else if (this.option.value == "false") {
      var element = document.getElementById("no_option_" + this.index);
      element.classList.add("button-selected-bool");
      var element2 = document.getElementById("yes_option_" + this.index);
      element2.classList.remove("button-selected-bool");
      this.value = "false";
      this.setTag(this.option);
    }
  },
  updated() {},
  created() {},
  computed: {
    ...mapGetters(["getNumPag", "getPagAct", "getvariablesTag", "getdataTags"])
  },
  methods: {
    ...mapActions(["setPagSurvey", "setError", "addTag"]),
    setTag(option) {
      if (option.tag !== undefined) {
        let tag = option.tag.map(a => {
          let c = {
            tag: a.key,
            value: a.value_key !== undefined ? a.value_key : this.value
          };
          return c;
        });
          // tags button_bool for yes and no.
          //for generate tags in the cases yes or not
          let data = [];
          if(option.tag_button_bool!=undefined && option.tag_button_bool.length >0){   
           if(this.value == "true"){
             data = option.tag_button_bool[0];
           }else{
             data = option.tag_button_bool[1];
           }
           data = data.tags.map(a => {
              let c = {
                  tag: a.key,
                  value: a.value_key !== undefined ? a.value_key : this.value
                };
                return c;
          });   
          this.addTag(data);  
        }
        this.addTag(tag);
      }
    },
    toggleButton(val) {
      if (val) {
        var element = document.getElementById("yes_option_" + this.index);
        element.classList.add("button-selected-bool");
        var element2 = document.getElementById("no_option_" + this.index);
        element2.classList.remove("button-selected-bool");
      } else {
        var element = document.getElementById("no_option_" + this.index);
        element.classList.add("button-selected-bool");
        var element2 = document.getElementById("yes_option_" + this.index);
        element2.classList.remove("button-selected-bool");
      }
      this.setError({ status: false, msj: "" });
      this.value = val == true ? "true" : "false";
      let obj = [
        {
          name: this.option.option_text,
          value: this.value
        }
      ];

      this.setPagSurvey(obj);
      this.setTag(this.option);
    }
  },
  props: ["option", "submited", "index"]
};
</script>

<style lang="scss" scoped>

</style>
