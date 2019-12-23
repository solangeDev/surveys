<template>
  <el-row class="survey-section">
    <div v-if="section">
      <transition :name="transName()">
        <survey-questions
          v-show="show"
          :section="section"
          :ancestors="{'formId': formId}"
          :key="getNumPag"
        />
      </transition>
      <el-button
        @click="goToPrevPag()"
        class="scroll-button"
        size="small"
        icon="el-icon-arrow-up"
        type="info"
        round
      >Prev</el-button>
    </div>
    <div v-else class="final-submit" v-loading.fullscreen="loading">
      <template v-if="getNumPag!=0">
        <el-alert
          v-if="this.$store.state.survey.error"
          :title="this.$store.state.survey.error_msj"
          type="error"
          center
          :closable="false"
          show-icon
        ></el-alert>
        <h3>Survey complete! Click to submit.</h3>
        <modalConfirmation v-if="this.getModalConfirmation !== null" :loading="false" />
        <el-button
          type="info"
          :class="{'is-disabled':disabled}"
          :disabled="disabled"
          @click="thanks()"
          icon="el-icon-check"
        >Submit Survey</el-button>
        <el-button
          @click="goToPrevPag()"
          class="scroll-button"
          size="small"
          icon="el-icon-arrow-up"
          type="info"
          round
        >Prev</el-button>
      </template>
      <template v-else>
        <div>loading...</div>
      </template>
    </div>
  </el-row>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import QuestionList from "@/components/QuestionList";
import EventBus from "../bus";
import api from "@/controllers/survey";
import modalConfirmation from "./types_data/modal_confirmation";

export default {
  name: "Section",
  data() {
    return {
      show: false,
      disabled: true,
      loading: true,
      btn_thanks: false,
    };
  },
  name: "Section",
  props: ["section", "formId", "access_code", "survey_id"],
  computed: {
    ...mapGetters([
      "sections",
      "direction",
      "currentSection",
      "getNumPag",
      "getStatusRequest",
      "getModalConfirmation"
    ])
  },
  methods: {
    ...mapActions(["goPrevPag", "initSurvey", "setError", "okModalConfirmation"]),
    goToPrevPag() {
      setTimeout(() => {
        if (this.getNumPag > 0) {
          this.okModalConfirmation(null);
          EventBus.$emit("set-disabled",true);
          this.goPrevPag();
        } else {
          this.initSurvey();
          this.$router.push({ name: "welcome" });
        }
      }, 300);
    },
    transName() {
      if (this.direction) {
        return "fade";
      } else {
        return "slide-fade";
      }
    },
    resetTransition() {
      this.show = false;
      setTimeout(() => {
        this.show = true;
      }, 300);
    },
    async thanks() {
      this.btn_thanks = true;
      const progress = this.$store.state.survey.numPag;
      const cant_questions = this.$store.state.survey.cantQuestion;
      const total = (progress * 100) / cant_questions;
      this.disabled = true;
      let param = {};
      param.access_code = this.$store.state.survey.access_code;
      param.client_id = this.$store.state.login.logger_payload.reference_id;
      param.participant_token = this.$store.state.survey.participant_token;
      param.form_id = this.$store.state.survey.form_id;
      param.participant_id = this.$store.state.login.logger_payload.id;
      param.survey_id = this.$store.state.survey.survey_id;
      const data = await api
        .getDataNewJson(param)
        .then(value => {
          return new Promise(resolve => {
            resolve(value.data);
          });
        })
        .then(function(value) {
          return value;
        })
        .catch(error => {
          if (error.response) {
          }
        });
      if (data.status == "success") {
        let type_surv = this.$store.state.survey.type_survey;
        param.copy_template = data.payload.form_template.sections;
        param.type_survey = this.$store.state.survey.type_survey;
        param.calc_progress = total;
        const save_data = await api
          .saveResponses(param)
          .then(value => {
            return new Promise(resolve => {
              resolve(value.data);
            });
          })
          .then(function(value) {
            return value;
          })
          .catch(error => {
            this.disabled = false;
            this.btn_thanks = false;
            if (error.response.status) {
              this.setError({
                status: true,
                msj: error.response.statusText
              });
              console.error(error);
            }
          });
        param.data = data.payload.form_template.sections;
        if (type_surv == "risk") {
          this.$router.push({ name: "thanks" });
        } else {
          const save = await api
            .getSaveSurvey(param)
            .then(value => {
              this.$router.push({ name: "welcome" });
            })
            .catch(error => {
              this.disabled = false;
              this.btn_thanks = false;
              if (error.response.status) {
                this.setError({
                  status: true,
                  msj: error.response.statusText
                });
                console.error(error);
              }
            });
        }
      }
    }
  },
  updated() {
    if (!this.section && this.getNumPag != 0) {
      setTimeout(() => {
        this.loading = false;
      }, 1500);
      if (this.getStatusRequest === true && this.btn_thanks == false && this.getModalConfirmation == null) {
        this.disabled = false;
      }
    }
  },
  beforeDestroy() {
    document.body.classList.remove("overflow");
  },
  mounted() {
    document.body.classList.add("overflow");
    this.resetTransition();
  },
  components: {
    "survey-questions": QuestionList,
    modalConfirmation: modalConfirmation
  },
  created() {
    this.questions = this.section;
    EventBus.$on("transition", () => {
      this.resetTransition();
    });
    EventBus.$on("set-disabled", (value) => {
      this.disabled = value;
    });
  }
};
</script>

<style>
.survey-section {
  height: auto;
}

.final-submit {
  height: 100vh;
  align-items: center;
  justify-content: center;
  display: flex;
  text-align: center;
  flex-direction: column;
}

.scroll-button {
  position: fixed;
  right: 5vmin;
  bottom: 10vmin;
}
</style>
