<template >
  <div>
    <ul class="section-questions">
      <li class="option-container">
        <el-alert
          v-if="this.$store.state.survey.error"
          :title="this.$store.state.survey.error_msj"
          type="error"
          center
          :closable="false"
          show-icon
        ></el-alert>
        <div class="header-text">
          <h3>{{this.getQuestion(section)}}</h3>
          <h3 v-if="section.description" class="question-desc">{{section.description}}</h3>
        </div>
        <template v-if="section.type !== 'form-dynamic-options'">
          <div v-for="(detail,indice) in section.question_options" :key="indice" class="mb">
            <modalForm
              v-if="detail.type=='modal_form'"
              :submited="submited"
              :option="detail"
              :section="section"
            />

            <Dragdrop
              v-if="detail.type=='sort-input'"
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              :submited="submited"
              :section="section"
            />

            <inputfile
              v-if="detail.type=='file'"
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              :submited="submited"
            />

            <range
              v-if="detail.type=='range-slider'"
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              :submited="submited"
            />

            <checkbox
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              :submited="submited"
              :section="section"
              v-if="(detail.type=='multiple-choice-checkbox' || detail.type=='single-choice-checkbox') && validTagOption(detail)"
            />

            <hidden
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              :submited="submited"
              v-if="detail.type=='hidden'"
            />

            <amount
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              :submited="submited"
              v-if="detail.type=='amount'"
            />

            <inputAddress
              :key="detail.option_text"
              :option="detail"
              v-if="detail.type=='address'"
              :submited="submited"
              :section="section"
            />

            <inputOption
              v-model="detail.value"
              :key="detail.option_text"
              :section="section"
              :option="detail"
              v-if="detail.type=='text'"
              :submited="submited"
              :questionType="section.type"
              :modal="false"
            />

            <inputNum
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              v-if="detail.type=='number'"
              :submited="submited"
              :questionType="section.type"
            />

            <textmask
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              v-if="detail.type=='text-mask'"
              :submited="submited"
            />

            <dropdown
              v-if="detail.type=='dropdown'"
              :option="detail"
              v-model="detail.value"
              :key="detail.option_text"
              :submited="submited"
              :section="section"
              :modal="false"
            />

            <simplecheckbox
              :section="section"
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              v-if="detail.type=='simple-checkbox'"
              :submited="submited"
              :index="indice"
            />

            <inputDate
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              v-if="detail.type=='date'"
              :submited="submited"
              :index="indice"
            />

            <optionautocomplete
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              v-if="detail.type=='autocomplete'"
              :submited="submited"
              :index="indice"
            />

            <maskExpression
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              v-if="detail.type=='mask-expression'"
              :submited="submited"
              :index="indice"
            />

            <amount
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              :submited="submited"
              v-if="detail.type=='amount'"
            />
            <buttonBool
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              :submited="submited"
              v-if="detail.type=='button_bool'"
              :index="indice"
            />
          </div>
        </template>
        <template v-else>
          <div v-for="(detail,indice) in section.question_options" :key="indice" class="mb">
            <modalForm
              v-if="detail.type=='modal_form'"
              :submited="submited"
              :option="detail"
              :section="section"
            />

            <checkbox
              :section="section"
              v-model="detail.value"
              :key="detail.option_text"
              :option="detail"
              :submited="submited"
              v-if="detail.type=='multiple-choice-checkbox' || detail.type=='single-choice-checkbox'"
            />

            <template v-if="detail.type=='text' || detail.type=='number'">
              <div
                style=" align-items: baseline; display:flex; flex-direction: row;  justify-content:space-between;"
              >
                <div>{{detail.option_text}}</div>
                <div>
                  <inputOption
                    v-model="detail.value"
                    :key="detail.option_text"
                    :option="detail"
                    :submited="submited"
                    :questionType="section.type"
                    :modal="false"
                  />
                </div>
              </div>
            </template>
          </div>
        </template>

        <button
          @click="saveForm"
          :class="{'is-disabled':submited}"
          :disabled="submited"
          v-show="showButton(section.question_options)"
          class="el-button el-button--info mt"
        >
          <i v-show="submited" class="el-icon-check">&nbsp;</i>Submit
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import MultipleChoice from "./types_data/checkbox";
import TextChoice from "./types_data/textchoice";
import TextMask from "./types_data/textmask";
import inputDate from "./types_data/datechoice";
import inputAddress from "./types_data/address";
import Dropdown from "./types_data/dropdown";
import simpleCheckbox from "./types_data/simplecheckbox";
import InputFile from "./types_data/optionfile";
import OptionAutocomplete from "./types_data/autocomplete";
import Hidden from "./types_data/hidden";
import Amount from "./types_data/amount";
import Range from "./types_data/range";
import Dragdrop from "./types_data/drag_drop";
import inputNum from "./types_data/number";
import buttonBool from "./types_data/button_bool";
import maskExpression from "./types_data/mask_expression";
import modalForm from "./types_data/modal_form";
import EventBus from "../bus";
import { invalid } from "moment";
var functions = require("../controllers/question-list");

export default {
  name: "QuestionList",
  components: {
    checkbox: MultipleChoice,
    inputOption: TextChoice,
    inputDate: inputDate,
    inputAddress: inputAddress,
    textmask: TextMask,
    dropdown: Dropdown,
    simplecheckbox: simpleCheckbox,
    inputfile: InputFile,
    optionautocomplete: OptionAutocomplete,
    hidden: Hidden,
    amount: Amount,
    range: Range,
    Dragdrop: Dragdrop,
    inputNum: inputNum,
    maskExpression: maskExpression,
    buttonBool: buttonBool,
    modalForm: modalForm
  },
  data() {
    return {
      questions: null,
      submited: false,
      error: [],
      sendForm: false,
      is_required: false,
      bannerError: false,
      hideButtonForTypes: ["single-choice-checkbox"]
    };
  },
  props: ["section"],
  created() {
    this.questions = this.section;
    document.getElementById("survey").style.overflow = "initial";
    document.getElementById("survey").style.height = "auto";

    /**
     * Function that modifies the father props from the children
     */
    EventBus.$on("set-value", value => {
      this.setPagSurvey(value);
    });

    /*
      Function that set the property submited for the option single-choice 
    */
    EventBus.$on("set-submited", value => {
      this.submited = value;
    });
  },
  mounted() {},
  updated() {},
  methods: {
    ...mapActions([
      "nextQuestion",
      "setPagSurvey",
      "nextQuestionMultiple",
      "setError",
      "actTags",
      "addTag",
      "updateRelationShip",
      "removeRelationShip"
    ]),
    validTagOption(data) {
      let valid = true;
      if (data.dependencies !== undefined) {
        const dependencies = data.dependencies;
        dependencies.forEach(a => {
          this.getvariablesTag.forEach(d => {
            let val_dep = Object.keys(a);
            if (d.tag !== undefined) {
              if (d.tag.search(val_dep[0]) !== -1) {
                if (a[val_dep].indexOf(d.value) == -1) {
                  valid = false;
                }
              }
            }
          });
        });
      }
      return valid;
    },
    getQuestion(question) {
      let newQuestion = question.question_text;
      // merge_fields risk
      if (
        question.question_tag !== undefined &&
        question.question_tag == true
      ) {
        let expresion = /\[\[[^\]]+:?\]\]/g;
        const arr_exp = newQuestion.match(expresion);
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
            if (a.search("{{AGE}}") !== -1) {
              obj.value = total_tag;
            }
            return obj;
          });
          arr.forEach(a => {
            if (Math.sign(a.value) == -0) {
              a.value = Math.abs(a.value);
            }
            newQuestion = newQuestion.replace(a.tag, `${a.value}`);
          });
        }
      }
      if (newQuestion.search("{{") !== -1) {
        const data = this.getvariablesTag;
        data.forEach(element => {
          if (newQuestion.search(element.tag) !== -1) {
            let value =
              element.value.charAt(0).toUpperCase() + element.value.slice(1);
            newQuestion = newQuestion.replace(element.tag, value);
          }
        });
      }
      return newQuestion;
    },
    //survey account opening
    async addListRelationShip() {
      const list_tags = this.getPagAct.add_relationship;
      if (list_tags !== undefined && list_tags.length > 0) {
        let tags = list_tags
          .filter(a => {
            if (a.value_key !== undefined) {
              return a;
            }
          })
          .map(z => {
            let b = {};
            b.tag = z.key;
            b.value = z.value_key;
            return b;
          });
        this.addTag(tags);
      }
      let b = {};
      b.relationship = this.$store.state.survey.marital_acronym;
      b.firm_id = this.$store.state.login.firm;
      b.first_name = this.getPagAct.question_options
        .filter(a => {
          if (a.key_name == "first_name") {
            return a;
          }
        })
        .map(b => {
          return b.value;
        })[0];
      b.last_name = this.getPagAct.question_options
        .filter(a => {
          if (a.key_name == "last_name") {
            return a;
          }
        })
        .map(b => {
          return b.value;
        })[0];
      b.middle_name = this.getPagAct.question_options
        .filter(a => {
          if (a.key_name == "middle_name") {
            return a;
          }
        })
        .map(b => {
          return b.value;
        })[0];
      b.client_id = functions.encrypMd5(`${b.first_name}${b.last_name}_spouse`);
      this.removeRelationShip();
      await this.updateRelationShip(b);
    },
    nextQuestionForm() {
      this.submited = true;
      if (
        this.section.add_list_relationship !== undefined &&
        this.section.add_list_relationship == true
      ) {
        this.addListRelationShip();
      }
      setTimeout(() => {
        this.nextQuestion();
      }, 50);
    },
    showButton(options) {
      let valid = false;
      if (
        (this.section.type !== "static-single-choice" &&
          this.section.type !== "form-dynamic-options") ||
        this.section.type == "multiple-dynamic-options"
      ) {
        valid = true;
      }
      return valid;
    },
    saveForm() {
      const data = this.getPagAct;
      if (this.section.type == "draw-form") {
        this.nextQuestionForm();
      }
      if (this.section.type == "static-form-group") {
        let options = this.$store.state.survey.pag_survey[0].question_options;
        let filter_opt = options
          .filter(a => {
            if (a.value === null || a.value == "") {
              return a;
            }
          })
          .filter(a => {
            if (a.value != false) {
              return a;
            }
          });
        if (filter_opt.length > 0) {
          this.submited = false;
          this.setError({ status: true, msj: "Please check your answer" });
        } else {
          this.nextQuestionForm();
        }
      }

      //validation static-multiple-choice and dynamic questions with options multiple-choice-checkbox
      if (
        this.section.type == "static-multiple-choice" ||
        this.section.type ==
          "multiple-dynamic-options" /*||
        (data.is_dynamic &&
          data.dynamic_option_types == "multiple-choice-checkbox")*/
      ) {
        if (
          this.section.verify_tag !== undefined &&
          this.section.verify_tag == true
        ) {
          //limpiar los tag de account opening "question is_insider"
          let options_arr = this.getPagAct.question_options
            .filter(a => {
              if (a.type == "multiple-choice-checkbox") {
                return a;
              }
            })
            .map(c => {
              return c.tag;
            });
          options_arr.forEach(a => {
            a.forEach(b => {
              let tags_arr = this.getvariablesTag.filter(c => {
                if (c.tag == b.key) {
                  return c;
                }
              });
              if (tags_arr.length == 0) {
                let datatag = [
                  {
                    tag: b.key,
                    value: "false"
                  }
                ];
                this.addTag(datatag);
              }
            });
          });
        }

        if (data.is_required) {
          const options = this.section.question_options;
          const cant = options.length;
          const inValid = options.filter(element => {
            if (element.value !== true) {
              return element;
            }
          });
          if (inValid.length == cant) {
            this.setError({ status: true, msj: "Please check your answer" });
          } else {
            this.submited = true;
            setTimeout(() => {
              this.nextQuestionMultiple();
            }, 300);
          }
        } else {
          this.submited = true;
          setTimeout(() => {
            this.nextQuestionMultiple();
          }, 300);
        }
      }

      if (this.section.validation !== undefined) {
        //validate percentage
        let index = Object.keys(this.section.validation).indexOf(
          "form-porcentage"
        );
        if (index !== -1) {
          if (Object.values(this.section.validation)[index]) {
            let validQuest = functions.validFormPorcentage(
              this.section.question_options
            );
            if (!validQuest) {
              this.submited = false;
              this.setError({
                status: true,
                msj: "All values ​​must not exceed 100%"
              });
            }
            functions.validVeeValidate(data.question_options, this.$validator);
            this.error = this.$validator.errors.items;
            setTimeout(() => {
              if (this.error.length > 0 || !validQuest) {
                this.submited = false;
              } else {
                this.nextQuestionForm();
              }
            }, 200);
          }
        }
        //validate phone-number-form
        index = Object.keys(this.section.validation).indexOf(
          "phone-number-form"
        );
        functions.validVeeValidate(data.question_options, this.$validator);
        this.error = this.$validator.errors.items;
        setTimeout(() => {
            if (index !== -1 && this.error.length == 0) {
              if (Object.values(this.section.validation)[index]) {
                this.submited = true;
                const cant = this.section.question_options.length;
                let validQuestion = functions.validPhoneNumbers(
                  this.section.question_options,
                  cant
                );
                if (!validQuestion) {
                  this.submited = false;
                  this.setError({
                    status: true,
                    msj: "Must register a phone number"
                  });
                }
                setTimeout(() => {
                  if (!validQuestion) {
                    this.submited = false;
                  } else {
                    this.nextQuestionForm();
                  }
                }, 200);
              }
            }
        },200);
      }

      if (this.section.type == "dynamic-form") {
        this.nextQuestionForm();
      }

      //validation static-form
      if (this.section.type == "static-form") {
        //actualiza el campo de address si este no fue cargado con el api de google maps
        if (
          this.section.preload_data !== undefined &&
          this.section.preload_data.indice == "['ClientAddresses']"
        ) {
          if (document.getElementById("address_line_1").value !== undefined) {
            let val = {};
            let values = [];
            val.name = "Address line 1";
            val.value = document.getElementById("address_line_1").value;
            values.push(val);
            this.setPagSurvey(values);
          }
        }
        if (data.is_required) {
          functions.validVeeValidate(data.question_options, this.$validator);
          this.error = this.$validator.errors.items;
          const is_poa = this.section.is_poa;
          let validPoa = null;
          if (is_poa !== undefined && is_poa == true) {
            validPoa = functions.validFormRelationshipPoa(
              data.question_options
            );
            
          }
          setTimeout(() => {
            if (
              this.error.length > 0 ||
              (validPoa !== null && validPoa.msj != "")
            ) {
              
              this.submited = false;
              if (is_poa !== undefined && is_poa == true) {
                let validEmailPoa = this.error.filter(a => {
                  if (a.field == "email") {
                    return a;
                  }
                });
                if (validEmailPoa.length > 0) {
                  validPoa = {};
                  validPoa.valid = false;
                  validPoa.msj = validEmailPoa[0].msg;
                }
                if(validPoa.msj != ""){
                   this.setError({
                    status: true,
                    msj: validPoa.msj
                  });
                }
              }
            } else {
              // update risk tags
              data.question_options.forEach(a => {
                if (a.key_tag !== undefined) {
                  let obj = {};
                  obj.value = a.value;
                  obj.tag = a.key_tag;
                  this.actTags(obj);
                }
              });
              this.nextQuestionForm();
            }
          }, 200);
        } else {
          this.nextQuestionForm();
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      "getRelationshipPep",
      "getPagAct",
      "getNumPag",
      "getProgress",
      "getvariablesTag",
      "getdataTags"
    ])
  }
};
</script>