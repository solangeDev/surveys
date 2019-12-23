<template>
  <div id="welcome">
    <h2>Welcome! Please select a survey.</h2>
    <survey-card v-if="survey" v-for="(survey, key) in this.surveys" :key="key" :survey="survey"/>
    <el-button
      @click="fullscreen()"
      class="scroll-button"
      size="small"
      icon="el-icon-rank"
      type="info"
      round
    >Enter Fullscreen</el-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SurveyCard from "./SurveyCard";
import LogRocket from "logrocket";

export default {
  name: "Welcome",
  data() {
    return {
      pointer: true
    };
  },
  async mounted() {
    LogRocket.identify(
      this.$store.state.login.logger_payload.phone,
      this.$store.state.login.logger_payload
    );
    try {
      if (this.token && this.unique_code) {
        let surveyData = {
          participant_token: this.token,
          unique_code: this.unique_code
        };
        this.initSurveys(surveyData);
      } else this.$router.push({ path: "/login" });
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    ...mapGetters(["unique_code", "surveys", "token"])
  },
  methods: {
    ...mapActions(["initSurveys"]),
    fullscreen() {
      document.documentElement.webkitRequestFullScreen();
    }
  },
  components: {
    "survey-card": SurveyCard
  }
};
</script>

<style lang="scss" scoped>
#welcome {
  width: 100%;
  padding-top: 15vh;
  text-align: center;
  padding-bottom: 15vh;
}
.scroll-button {
  position: fixed;
  left: 5vmin;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  bottom: 5vmin;
}
</style>
