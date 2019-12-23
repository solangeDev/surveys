<template>
  <div v-loading.fullscreen="loading">
    <el-row class="checkbox-row">
      <b-modal ref="vuemodal" hide-footer :title="this.option.title_modal">
        <div v-for="(detail,indice) in this.option.form_options" :key="indice">
          <dropdown
            v-if="detail.type=='dropdown'"
            :option="detail"
            v-model="detail.value"
            :key="detail.option_text"
            :submited="submited"
            :modal="true"
          />
          <inputOption
            v-model="detail.value"
            :key="detail.option_text"
            :option="detail"
            v-if="detail.type=='text'"
            :submited="submited"
            :questionType="section.type"
            :section="section"
            :modal="true"
          />
        </div>
        <div class="modal_buttons">
          <b-button
            class="el-button-submit"
            :class="{'button-selected':checked,'is-disabled':submited}"
            :disabled="submited"
            variant="outline-warning"
            block
            @click="toggleModal"
          >Save</b-button>
        </div>
      </b-modal>
      <b-button
        @click="showModal"
        id="myTextField"
        :class="{'button-selected':checked,'is-disabled':submited}"
        :disabled="submited"
        class="el-checkbox is-bordered el-button-modal"
      >{{this.option.option_text}}</b-button>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
import { BModal, BButton } from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue.css";
import Dropdown from "./dropdown";
import TextChoice from "./textchoice";
var functions = require("../../controllers/question-list");

export default {
  name: "modalRelationship",
  components: {
    "b-modal": BModal,
    "b-button": BButton,
    dropdown: Dropdown,
    inputOption: TextChoice,
  },
  data() {
    return {
      checked: false,
      error: [],
      loading: false,
      sub: false
    };
  },
  updated() {},
  mounted() {},
  methods: {
    setResponse(dataOptions) {
      let objResp = {};
      dataOptions.forEach(element => {
        objResp[element.key_name] = element.value;
      });
      objResp.client_id = this.$store.state.login.logger_payload.reference_id;
      return objResp;
    },
    showModal() {
      this.cleanInputsForm();
      this.$refs["vuemodal"].show();
    },
    hideModal() {
      this.$refs["vuemodal"].hide();
    },
    async toggleModal() {
      const dataPag = this.getPagAct.question_options.filter(a => {
        if (a.type == "modal_form") {
          return a;
        }
      });
      if (dataPag.length > 0) {
        const dataOptions = dataPag[0].form_options;
        functions.validVeeValidate(dataOptions, this.$validator);
        this.error = this.$validator.errors.items;
        setTimeout(() => {
          if (this.error.length > 0) {
            EventBus.$emit("set-submited", false);
          }
        }, 70);
        if (this.error.length == 0) {
          setTimeout(() => {
            if (this.error.length == 0) {
              this.loading = true;
              const formatResp = this.setResponse(dataOptions);
              formatResp.option_detail = this.option;
              formatResp.firm_id = this.$store.state.login.firm;
              this.$store
                .dispatch("addRelationShip", formatResp)
                .then(response => {
                  if (response === true) {
                    this.setStatusRequest(false);
                    setTimeout(() => {
                      this.$refs["vuemodal"].hide();
                      this.loading = false;
                      EventBus.$emit("set-submited", false);
                    }, 600);
                  }
                })
                .catch(function(e) {
                  console.log(e);
                  this.$refs["vuemodal"].hide();
                  this.loading = false;
                  EventBus.$emit("set-submited", false);
                  this.setError({ status: true, msj: "Error relationship" });
                });
            }
          }, 200);
        }
      }
    },
    ...mapActions([
      "cleanInputsForm",
      "addRelationShip",
      "setStatusRequest",
      "setError"
    ])
  },
  computed: {
    ...mapGetters(["getPagAct", "getStatusRequest"])
  },
  props: ["submited", "option", "section"]
};
</script>
