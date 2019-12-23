<template>
  <div id="login">
    <transition name="fade">
      <!-- phone input -->
      <div v-if="!code" class="login-container">
        <el-alert
          v-if="this.$store.state.survey.error"
          :title="this.$store.state.survey.error_msj"
          type="error"
          center
          :closable="false"
          show-icon
        ></el-alert>
        <el-alert
          class="error"
          v-if="error === true"
          title="Please check the phone number you entered"
          type="error"
          center
          :closable="false"
          show-icon
        ></el-alert>
        <el-row class="login-row">
          <h3>Please enter your phone number and we'll send you an access code.</h3>
          <el-input
            class="phone-input"
            autofocus="true"
            v-model="phone"
            placeholder="123-457-8901"
            type="tel"
            minlength="12"
            maxlength="12"
            name="telInput"
            @keyup.enter.native="toggleInput()"
            v-mask="'###-###-####'"
          ></el-input>
          <el-row>
            <el-button
              :disabled="disabled_button"
              type="info"
              icon="el-icon-check"
              native-type="submit"
              @click="toggleInput()"
              size="medium"
            >Continue</el-button>
          </el-row>
        </el-row>
      </div>
    </transition>
    <transition name="fade">
      <!-- code input -->
      <div v-if="code" class="login-container">
        <el-alert
          class="error"
          v-if="error === true"
          title="Please check the code you entered"
          type="error"
          center
          :closable="false"
          show-icon
        ></el-alert>
        <el-row class="login-row">
          <h3>Please enter the code you received.</h3>
          <el-input
            class="code-input"
            autofocus="true"
            v-model="codeVal"
            placeholder="55555"
            ref="code"
            type="tel"
            maxlength="5"
            name="codeInput"
            @keyup.enter.native="submitCode()"
          ></el-input>
          <el-row>
            <el-button
              type="info"
              icon="el-icon-check"
              native-type="submit"
              @click="submitCode()"
              size="medium"
            >Enter</el-button>
          </el-row>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { mask } from "vue-the-mask";
import env from '../env';
var functions = require("../controllers/question-list");

export default {
  name: "app-login",
  data() {
    return {
      phone: "",
      codeVal: "",
      code: false,
      error: false,
      firm_url: null,
      disabled_button: false,
      validTemplate: env.availableThemes
    };
  },
  computed: {
    ...mapGetters(["unique_code", "token"])
  },
  created() {},
  mounted() {
    this.clearToken();
    this.validFirmLogin();
    document.getElementById("survey").style.overflow = "hidden";
    document.getElementById("survey").style.height = "100%";
  },
  methods: {
    ...mapActions(["initLogin", "initSurveys", "clearToken", "setError"]),
    validFirmLogin() {
      this.firm_url = functions.getParametersUrl().firm;
      if (this.validTemplate.indexOf(this.firm_url) == -1 || this.firm_url === undefined || this.firm_url === "undefined") {
        this.disabled_button = true;
        this.setError({ status: true, msj: "Firm value not provided" });
      }
    },
    // validate phone input vs length,
    toggleInput() {
      if (this.phone.length === 12) {
        this.login();
      } else {
        this.error = true;
      }
    },
    // makes call to login endpoint to initialize a token and send it by SMS
    async login() {
      let loginData = {
        phone: this.phone,
        access: this.$route.params,
        reference_id: this.$route.query.id,
        firm: this.$store.state.login.firm
      };
      try {
        this.error = false;
        await this.initLogin(loginData);
        this.code = true;
      } catch (error) {
        console.log(error);
        this.error = true;
      }
    },
    // validate code vs token, set loggedIn to true, go to /survey
    async submitCode() {
      try {
        if (this.codeVal.length === 5) {
          let state = this.$store.state;
          let surveyData = {
            participant_token: this.codeVal,
            unique_code: this.unique_code,
            firm: state.login.firm
          };
          await this.initSurveys(surveyData);
          state.isLoggedIn = true;
          this.error = false;
          this.$router.push({ name: "welcome" });
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
        console.log(error);
      }
    }
  },
  directives: { mask }
};
</script>

<style lang="scss" scoped>
#login {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
  .login-container {
    height: 100vh;
    overflow-y: hidden !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .login-row {
      width: 100%;
      text-align: center;
      .el-input {
        font-size: 3em;
        margin-bottom: 0.33em;
      }
      @media (max-width: 400px) {
        .el-input.phone-input {
          font-size: 2em;
        }
      }
    }
  }
  p {
    color: #a6a9ad;
    font-size: 0.8em;
    padding-top: 5em;
  }
}
</style>
