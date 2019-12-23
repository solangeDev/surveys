<template>
  <div :class="'form-' + form_id" class="form">
      <survey-section v-if="this.$store.state.survey.loaded"
        :access_code="access_code"
        :survey_id="survey_id"
        :section="getPagAct"
        :formId="form_id"
      />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Section from "@/components/Section";

export default {
  name: "Form",
  props: ["access_code", "form_id", "survey_id"],
  data() {
    return {
      questions: null
    };
  },
  async mounted() {
    await this.loadDataSection();
    // if there's no token go to /login to get one
    if (!this.form_id) {
      this.$router.push({ path: "/login" });
    }
  },
  methods: {
    ...mapActions(["setFormTemplate"]),
    async loadDataSection() {
      let data = {};
      data.access_code = this.access_code;
      data.form_id = this.form_id;
      data.survey_id = this.survey_id;
      data.participant_token = this.$store.state.form.token;
      data.participant_id = this.$store.state.login.logger_payload.id;
      await this.setFormTemplate(data);
    }
  },
  computed: {
    ...mapGetters(["getPagAct", "getNumPag", "getProgress"])
  },
  components: {
    "survey-section": Section
  }
};
</script>

<style lang="scss" scoped>
.scroll-button {
  position: fixed;
  right: 5vmin;
  bottom: 10vmin;
}
</style>
