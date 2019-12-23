<template>
  <el-card v-if="this.latest" class="survey-card">
    <h3 class="form-title">{{this.latest.form.name}}</h3>
    <h3 class="form-description" style="font-weight: normal">{{survey.form.description}}</h3>
    <div class="bottom-row">
      <div>
        <!-- <p class="p-sm">Survey Status: <span>{{this.latest.status}}</span></p>
        <p class="p-sm" v-if="progress !== null">Progress: <span>{{progress.percentage.toFixed([0])}}% complete</span></p>-->
        <p class="p-sm">
          Progress:
          <span>{{(this.survey.form_template !== null)?Math.round(this.survey.form_template.progress):0}}%</span>
        </p>
        <p class="p-sm">
          Survey Status:
          <span>{{(this.survey.form_template !== null)?this.survey.form_template.status:"pending"}}</span>
        </p>
      </div>
      <!-- {{this.survey.survey_progress}} -->
      <!--<el-button v-if="this.latest.status !== 'completed'" type="info" @click="enterSurvey(latest)" size="medium">Enter Survey</el-button>
      <el-button v-if="this.latest.status === 'completed'" @click="rewriteSurvey(latest)" icon="el-icon-edit" type="info" size="medium">Rewrite Survey</el-button>-->
      <div v-if="this.survey.form_template !== null">
        <div v-if="this.survey.form_template.status == 'completed'">
          <span>Completed</span>
        </div>
        <div v-else>
          <el-button type="info" @click="enterSurvey(latest)" size="medium">Enter Survey</el-button>
        </div>
      </div>
      <div v-else>
        <el-button type="info" @click="enterSurvey(latest)" size="medium">Enter Survey</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "SurveyCard",
  props: ["survey"],
  data() {
    return {
      progress: null,
      preload: null,
      dataState: null
    };
  },
  async mounted() {
    this.clearRules();
    try {
      let latestId = this.$props.survey.survey.slice(-1)[0].id;
      let detailsData = {
        survey_id: latestId,
        token: this.token,
        unique_code: this.unique_code,
        access_code: this.latest.form.access_code,
        firm: this.$store.state.login.firm
      };
      let details = await this.initDetails(detailsData);
      this.preload = details.payload.survey.data;
      this.progress = details.payload.survey.completed_summary;
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    ...mapGetters([
      "unique_code",
      "surveys",
      "merge_fields",
      "token",
      "logger_payload"
    ]),
    latest() {
      let latest = this.survey.survey.slice(-1);
      return latest[0];
    }
  },
  methods: {
    ...mapActions([
      "initDetails",
      "initReset",
      "populateField",
      "clearTotal",
      "clearRules",
      "clearSurveys",
      "clearFields",
      "initSurvey",
      "initTags"
    ]),
    async rewriteSurvey(payload) {
      try {
        if (this.latest.status === "completed") {
          // eslint-disable-next-line
          let survey_id = payload.id;
          // eslint-disable-next-line
          let complete = payload.status;
          // eslint-disable-next-line
          let form_id = payload.form.id;
          // eslint-disable-next-line
          let data = this.preload;
          // eslint-disable-next-line
          let access_code = payload.form.access_code;
          // eslint-disable-next-line
          let token = this.$route.params.token;
          let resetData = {
            survey_id,
            complete,
            form_id,
            data,
            access_code,
            unique_code: this.unique_code,
            participant_token: this.token
          };
          this.clearFields();
          let newSurvey = await this.initReset(resetData);
          this.clearTotal();
          this.populateField(this.preload);
          let newSurveyId = newSurvey.data.payload.id;
          /*this.$router.push({ name: 'survey', params: {access_code, form_id, survey_id: newSurveyId, complete} })*/
        }
      } catch (error) {
        if (error.response.data.declaration === "already_exists") {
          // eslint-disable-next-line
          let newSurveyId = error.response.data.payload.id;
          // eslint-disable-next-line
          let complete = payload.status;
          // eslint-disable-next-line
          let form_id = payload.form.id;
          // eslint-disable-next-line
          let access_code = payload.form.access_code;
          // revisar esta estructura
          // this.$router.push({ name: 'survey', params: {access_code, form_id, survey_id: newSurveyId, complete} })
        } else {
          console.log(error);
        }
      }
    },
    enterSurvey(payload) {
      const data_tags = payload.data;
      this.initTags(data_tags)
      // eslint-disable-next-line
      let survey_id = payload.id;
      let complete = payload.status;
      // eslint-disable-next-line
      let form_id = payload.form.id;
      // eslint-disable-next-line
      let access_code = payload.form.access_code;
      let token = this.$route.params.token;
      this.populateField(this.preload);
      let data = this.preload;
      let resetData = {
        survey_id,
        complete,
        form_id,
        data,
        access_code,
        unique_code: this.unique_code,
        participant_token: this.token
      };
      let participant_id = this.logger_payload.id;
      let participant_token = this.token;
      this.initSurvey();
      this.$router.push({
        name: "survey",
        params: {
          participant_token,
          participant_id,
          form_id,
          access_code,
          token,
          survey_id,
          complete
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.survey-card {
  width: 100%;
  text-align: left;
  margin-bottom: 1.5em;
  .form-title {
    text-transform: capitalize;
  }
  .form-description {
    font-weight: 500;
    text-transform: capitalize;
  }
  span {
    font-weight: bold;
    text-transform: capitalize;
  }
  .p-sm {
    font-size: 80%;
  }
  .bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
}
</style>
