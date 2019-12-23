<template>
  <div v-show="filterOptionTag()">
    <el-row class="checkbox-row">
      <el-col :span="24">
        <el-checkbox
          :ref="option.option_text"
          border
          :id="'label_' + option.option_text + option.valueBack"
          :label="getOptionText(option)"
          :disabled="submited"
          @change="toggleChoice(option)"
          v-model="valueChoice"
          :class="{'capitalize':textCapitalize(),'is-disabled':submited,'check-single':classUnChecked, 'center':(this.option.accept_button === undefined)?false:this.option.accept_button}"
        ></el-checkbox>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";

export default {
  name: "MultipleChoice",
  data() {
    return {
      valueChoice: null,
      response: {},
      classUnChecked: false
    };
  },
  updated() {},
  mounted() {
    if (this.option.value === true) {
      this.classUnChecked = false;
    }
    this.addTagMounted();
    this.showClassChecked();
  },
  methods: {
    showClassChecked() {
      //load class checked value
      if (this.option.value == true) {
        this.getPagAct.question_options.forEach(z => {
          if (
            z.type == "multiple-choice-checkbox" ||
            z.type == "single-choice-checkbox"
          )
            var element1 = document.getElementById(
              "label_" + z.option_text + z.valueBack
            );
          if (element1 !== undefined && element1 !== null) {
            if (
              Object.values(element1.classList).indexOf("checked-choice") !== -1
            ) {
              element1.classList.remove("checked-choice");
            }
          }
          if (z.value === true) {
            var element = document.getElementById(
              "label_" + z.option_text + z.valueBack
            );
            if (element !== undefined && element !== null) {
              element.classList.add("checked-choice");
            }
          }
        });
      }
    },
    addTagMounted() {
      if (this.option.valueBack == "is_mailing" && this.option.value == true) {
        let tag = [{ tag: "{{is_mailing}}", value: "is_mailing" }];
        this.addTag(tag);
      }
      if (
        this.option.value == true &&
        this.option.type == "multiple-choice-checkbox"
      ) {
        if (this.option.tag !== undefined) {
          let tag = this.option.tag.map(a => {
            let c = {};
            c.tag = a.key !== undefined && a.tag == undefined ? a.key : a.tag;
            c.value = this.option.valueBack;
            if (a.value_key !== undefined) {
              c.value = a.value_key;
            } else if (a.value !== undefined && typeof a.value !== "boolean") {
              c.value = a.value;
            }
            return c;
          });
          this.addTag(tag);
        }
      }
    },
    filterOptionTag() {
      let valid = true;
      let indice = this.getPagAct.filter_section_data;
      if (indice !== undefined && indice.length > 0) {
        indice.forEach(a => {
          let fil = this.getvariablesTag.filter(b => {
            if (b.tag === a.tag && b.value === "true") {
              const data = this.getClientData.relationships;
              const dataFilter = data.filter(c => {
                if (c.client_details[0].id == this.option.valueBack) {
                  if (Array.isArray(a.value)) {
                    valid =
                      a.value.indexOf(c.relationship) !== -1 ? false : true;
                  } else {
                    valid = c.relationship === a.value;
                  }
                }
              });
            }
          });
        });
      }
      return valid;
    },
    textCapitalize() {
      let oper = false;
      if (this.option.attributes !== undefined) {
        if (
          this.option.attributes.capitalize !== undefined &&
          this.option.attributes.capitalize == true
        ) {
          oper = true;
        }
      }
      return oper;
    },
    getOptionText(option) {
      let text_option = option.option_text;
      if (option.option_tag !== undefined && option.option_tag == true) {
        let expresion = /\[\[[^\]]+:?\]\]/g;
        const arr_exp = text_option.match(expresion);
        if (arr_exp.length > 0) {
          const arr = arr_exp.map(a => {
            let tag = a.split("{{");
            let cal = tag[0].split("[[");
            tag = tag[1].split("}}");
            tag = tag[0];
            let tag_value = this.getdataTags[`{{${tag}}}`];
            cal = `${cal[1]} ${tag_value}`;
            let total_tag = eval(cal);
            let obj = {};
            obj.tag = a;
            obj.value = total_tag
              .toFixed(2)
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            obj.value = obj.value.match(/.+(?=\.)/)[0];
            return obj;
          });
          arr.forEach(a => {
            if (Math.sign(a.value) == -0) {
              a.value = Math.abs(a.value);
            }
            text_option = text_option.replace(a.tag, `${a.value}`);
          });
        }
      }
      return text_option;
    },
    emitQuestionSingle(data) {
      this.nextQuestionSingle(data);
    },
    validTagOption(data) {
      let valid = true;
      if (data.dependencies !== undefined) {
        const dependencies = data.dependencies;
        dependencies.forEach(a => {
          this.getvariablesTag.forEach(d => {
            let val_dep = Object.keys(a);
            if (d.tag.search(val_dep[0]) !== -1) {
              if (a[val_dep].indexOf(d.value) == -1) {
                valid = false;
              }
            }
          });
        });
      }
      return valid;
    },
    ...mapActions([
      "nextQuestionSingle",
      "setPagSurvey",
      "setPagSurvey2",
      "setError",
      "addTag",
      "setDataRelationshipPep",
      "removeRelationShip"
    ]),
    toggleChoice(option) {
      const obj = {};
      let arr = [];
      if (option.type == "single-choice-checkbox") {
        EventBus.$emit("set-submited", true);
        if (this.valueChoice == true) {
          obj.id = option.id;
          obj.name = option.option_text;
          obj.value = true;
        } else {
          obj.id = option.id;
          obj.name = option.option_text;
          obj.value = true;
        }
        arr = [...arr, obj];
        // remove all classes is_checked
        if (this.getPagAct.type == "multiple-dynamic-options") {
          this.getPagAct.question_options.forEach(element => {
            if (element.type == "multiple-choice-checkbox") {
              var element = document.getElementById(
                "label_" + element.option_text + element.valueBack
              );
              element.classList.remove("checked-choice");
            }
          });
        } else {
          this.getPagAct.question_options.forEach(z => {
            if (z.type == "single-choice-checkbox") {
              var element = document.getElementById(
                "label_" + z.option_text + z.valueBack
              );
              if (
                element.className.indexOf("checked-choice") != -1 &&
                this.validTagOption(option) == false
              ) {
                element.classList.remove("checked-choice");
              }
            }
          });
        }
        if (option.tag !== undefined) {
          let tag = option.tag.map(a => {
            let c = {};
            c.tag = a.key !== undefined && a.tag == undefined ? a.key : a.tag;
            c.value = option.valueBack;
            if (a.value_key !== undefined) {
              c.value = a.value_key;
            } else if (a.value !== undefined && typeof a.value !== "boolean") {
              c.value = a.value;
            }
            return c;
          });
          this.addTag(tag);
        }

        // detail of the relationship for the pep section
        let arrTag = [
          {
            tag: "{{relationship_pep}}",
            value: "false"
          }
        ];
        if (
          option.relationship_pep !== undefined &&
          option.relationship_pep == true
        ) {
          arrTag[0].value = "true";
          this.addTag(arrTag);
          this.setDataRelationshipPep(option.valueBack);
        } else {
          this.addTag(arrTag);
        }
        // remove the checked class once selected
        setTimeout(() => {
          this.classUnChecked = true;
          this.emitQuestionSingle(arr);
        }, 300);
      } else if (option.type == "multiple-choice-checkbox") {
        var element = document.getElementById(
          "label_" + option.option_text + option.valueBack
        );
        if (element.className.indexOf("checked-choice") != -1) {
          this.valueChoice = false;
          obj.id = option.id;
          obj.name = option.option_text;
          obj.value = option.valueBack;
          var element = document.getElementById(
            "label_" + option.option_text + option.valueBack
          );
          element.classList.remove("checked-choice");
          element.classList.remove("is-checked");
        } else {
          if (this.valueChoice == true) {
            this.setError({ status: false, msj: "" });
            //EventBus.$emit("show-error", true);
            obj.id = option.id;
            obj.name = option.option_text;
            obj.value = true;
          } else {
            obj.id = option.id;
            obj.name = option.option_text;
            obj.value = option.valueBack;
          }
        }
        arr = [...arr, obj];
        if (this.section.type == "multiple-dynamic-options") {
          this.setPagSurvey2(arr);
        } else {
          this.setPagSurvey(arr);
        }

        if (option.tag !== undefined) {
          let tag = option.tag.map(a => {
            let value_op = option.valueBack;
            if (a.value_key !== undefined) {
              value_op = a.value_key;
            } else if (a.value !== undefined && typeof a.value !== "boolean") {
              value_op = a.value;
            }
            let tag_name =
              a.key !== undefined && a.tag == undefined ? a.key : a.tag;
            let c = { tag: tag_name, value: value_op };
            if (a.verify !== undefined && a.verify == true) {
              if (!this.valueChoice) {
                c = { tag: a.key, value: this.valueChoice };
              }
            }

            return c;
          });
          if (option.value == true && option.valueBack == "is_mailing") {
            tag = [{ tag: "{{is_mailing}}", value: "false" }];
          }

          this.addTag(tag);

          //unchecked add_relationship
          if (this.section.type == "multiple-dynamic-options") {
            this.getPagAct.question_options.forEach(element => {
              if (element.type == "single-choice-checkbox") {
                var element = document.getElementById(
                  "label_" + element.option_text + element.valueBack
                );
                element.classList.remove("checked-choice");
              }
            });
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      "getNumPag",
      "getPagAct",
      "getvariablesTag",
      "getdataTags",
      "getClientData"
    ])
  },
  props: ["option", "submited", "error", "section"]
};
</script>
<style lang="" scope>
.center {
  text-align: center !important;
}
</style>
