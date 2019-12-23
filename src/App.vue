<template>
  <div id="survey">
    <!-- main header w/ img -->
    <el-header class="main-header">
      <div>
        <img :src="src_image" alt />
        <h4 class="section-name">{{ sectionName() }}</h4>
      </div>
    </el-header>
    <!-- router view -->
    <el-main class="main-view">
      <router-view></router-view>
    </el-main>
    <!-- floading (fixed) progress bar -->
    <div class="progress-bar" v-if="this.$route.name === 'survey'">
      <el-progress :percentage="progress" :show-text="false" :stroke-width="10"></el-progress>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
const functions = require("./controllers/question-list");
import env from '@/env';

export default {
  name: "Survey",
  data() {
    return {
      firm_template: null,
      src_image: require("../static/themes/fwp/images/welcome-image.png"),
      validTemplate: env.availableThemes
    };
  },
  created() {
    this.setAppFirmTemplate();
  },
  mounted() {},
  updated(){},
  methods: {
    ...mapActions([
      'setFirmTemplate'
    ]),
    sectionName() {
      if (this.$route.name === "survey") {
        if (this.$store.state.survey.pag_survey != null) {
          if (this.$store.state.survey.pag_survey.length > 0) {
            return this.getSectionName;
          }
        }
      }
    },setAppFirmTemplate(){
      let firm_url = functions.getParametersUrl().firm;
      if (this.validTemplate.indexOf(firm_url) === -1 || firm_url === "undefined" || firm_url === undefined) {
        firm_url = env.default_theme;
      }
      this.firm_template = firm_url;
      this.src_image = require(`../static/themes/${this.firm_template}/images/welcome-image.png`)
      this.setFirmTemplate(this.firm_template);
    }
  },
  computed: {
    ...mapGetters([
      "sections",
      "total_submitted",
      "currentSection",
      "getSectionName",
      "getProgress"
    ]),

    progress() {
      const data = this.getProgress;
      if (data.progress > 0) {
        return (data.progress * 100) / data.cant;
      } else {
        return 0;
      }
    }
  }
};
</script>

<style lang="">
#survey{
    height: 100%;
    width: 100%;
    overflow: hidden;
}
</style>
