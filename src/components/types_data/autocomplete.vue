
<template>
     <el-row class="checkbox-row">
        <el-col :span="24">
            <p>{{option.option_text}}</p>
            <div class="mb-autocomplete">
            <template>
               <v-select
                :id="option.option_text"
                :key="option.option_text"
                :ref="option.option_text"
                :disabled="submited"
                :name="option.attributes.key_validate"
                :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
                :options="dataAutocomplete.data" v-model="proxyValue"
                @input="onChange()"
                v-validate="setJsonValidate(option.validation)"></v-select>
            </template>
            </div>
        </el-col>
        <span class="error-msj">{{errors.first(option.attributes.key_validate)}}</span>
     </el-row>
</template>

<style lang="" scope>
  .vs__dropdown-menu {
    max-height: 100px ;
  }
  .vs__search::placeholder{
    color:#c2c5ca;
  }
</style>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import api from '@/controllers/survey'


export default {
  name: "OptionAutocomplete",
  components: {
    vSelect,
  },
   data() {
    return {
      value: "",
      dataAutocomplete:{
        placeholder:null,
        data:[],
        predata:[],
        selected:null
      },
    };
  },
  computed: {
    proxyValue: {
      get() {
        if(this.option.value != null){
            this.dataAutocomplete.selected = this.option.value;
        }
        return this.dataAutocomplete.selected;
      },
      set(newValue) {
        this.dataAutocomplete.selected = newValue;
        this.$emit("input", newValue);
      }
    }
  },
  mounted() {
    this.dataAutocomplete.selected = this.option.value;
  },
  updated() {
    this.dataAutocomplete.selected = this.option.value;
  },
  created() {
    this.getAxiosAutocomplete();
  },
  methods: {
    ...mapActions([
      'getDataToken',
      'setPagSurvey'
    ]),
    setJsonValidate(val) {
      const filtered = Object.keys(val).filter(key => {
        if (val[key]) {
          return key;
        }
      });
      return filtered.join("|");
    },
    onChange() {
      const inputFill = this.option.inputFilled;
      const arrVal = inputFill.map((c)=>{
        let val = {};
        val.name = c.option_text;
        val.value = this.option.value[c.key_name];
        return val;
      })
      this.setPagSurvey(arrVal);
    },
    async getAxiosAutocomplete(){
      let param = {};
      param.access_code = this.$store.state.survey.access_code;
      param.participant_token = this.$store.state.survey.participant_token;
      const token = await api.getDataToken(param).then(value => {
        return new Promise(resolve => {
            resolve(value.data)
        })
      }).then(function (value) {
        return value;
      })
      if(token){
        let obj = {};
        let index = this.option.attributes.api.index
        obj.source = this.option.attributes.api.source;
        obj.method = this.option.attributes.api.method;
        obj.token = token;
        let slf = this;
        await api.getDataAutocomplete(obj).then(value => {
            return new Promise(resolve => {
               resolve(value.data.results)
            })
        }).then(function (value) {
            slf.dataAutocomplete.predata = value;
        })
        if(this.dataAutocomplete.predata !== null){
           switch (index) {
            case "autocomplete-institutions":
                const dataAuto = this.dataAutocomplete.predata.map((i)=>{
                    let newObj = {}
                    newObj.label = `${i.bank_name} - ${i.transit_no}`
                    newObj.id = i.institution_no
                    newObj.transit_no = i.transit_no
                    return newObj
                })
                this.dataAutocomplete.data = dataAuto;
            break;
           }
        }        
      }
    }
  },
 props: ["option", "submited"]
};
</script>
