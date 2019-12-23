<template>
  <div v-loading.fullscreen="loading">
    <el-row class="checkbox-row">
      <b-modal  no-close-on-backdrop ref="vuemodal" hide-footer :title="this.option.txt_title">
        {{this.option.txt_modal}}
        <div class="modal_buttons">
          <b-button
            class="el-button-submit"
            variant="outline-warning"
            block
            @click="toggleModal"
          >{{this.option.txt_btn}}</b-button>
        </div>
      </b-modal>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
import { BModal, BButton } from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  name: "modalConfirmation",
  components: {
    "b-modal": BModal,
    "b-button": BButton,
  },
  data() {
    return {
      option:{
         "txt_title": "",
        "txt_modal": "",
        "txt_btn": ""
      }
    };
  },
  updated() {},
  mounted() {
    this.showModal();
    this.option = this.getModalConfirmation; 
  },
  methods: {
    ...mapActions([
      "okModalConfirmation",
    ]),
    showModal() {
      this.$refs["vuemodal"].show();
    },
    async toggleModal() {
      this.okModalConfirmation(true);
      await EventBus.$emit("set-disabled",false);
      this.$refs["vuemodal"].hide();
    },
    ...mapActions([
      "goPrevPag",
    ])
  },
  computed: {
    ...mapGetters(["getModalConfirmation"])
  },  
  props: ["loading"],
};
</script>

<style lang="">
  .modal-content {
    text-align: center !important;
  }
</style>
