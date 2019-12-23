<template>
    <div>
      <el-row class="checkbox-row">
      <el-col :span="24">
        <file-upload class="file-upload" :name="option.option_text" :url='url' :thumb-url='thumbUrl' :headers="headers" @change="onFileChange" ></file-upload>
      </el-col>
      <span class="error-msj">{{errors.first(option.option_text)}}</span>
      </el-row>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import EventBus from "../../bus";
import FileUpload from 'v-file-upload'


export default {
  name: "InputFile",
  components: {
    FileUpload,
  },
  data() {
    return {
      /* Input File */
      url: 'http://your-post.url',
      headers: {'access-token': '<your-token>'},
      filesUploaded: [],
    };
  },
  mounted() {
    
  },
  updated() {
    
  },
  created() {
   
  },
  methods: {
    ...mapActions(["setError"]),
     thumbUrl (file) {
      return file.myThumbUrlProperty
    },
    onFileChange (file) {
      this.fileUploaded = file
    },
    setJsonValidate(val) {
      const filtered = Object.keys(val).filter(key => {
        if (val[key]) {
          return key;
        }
      });
      return filtered.join("|");
    },
    setJsonValidate(val) {
      const filtered = Object.keys(val).filter(key => {
        if (val[key]) {
          return key;
        }
      });
      return filtered.join("|");
    }
  },
  computed: {
    ...mapGetters(["getNumPag"]),

    proxyValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      }
    }
  },
  props: ["option", "submited"]
};

</script>

