<template>
  <div>
    <el-row class="checkbox-row">
     <p>{{option.option_text}}</p>
     <!-- v-model="value" -->
      <el-col :span="24">
         <el-input
          :id="option.option_text"
          :key="option.option_text"
          :ref="option.option_text"
          :disabled="submitted"
          :type="option.type"
          :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
          :name="option.option_text"
          @change="setResponse(option)"
          v-model="value"            
          v-validate="setJsonValidate(option.validation)"
          />
      </el-col>
      <span class="error-msj">{{errors.first(option.option_text)}}</span>
    </el-row>
  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from '../../bus'

export default {
  data() {
    return {
      response: {},
      value : null,
      valuesGlobales:null,
    };
  },
  /**  
   * Funcion que permite desde el padre emitir un evento 
   * mopdificar el v-model del hijo
  */
  /*created(){
    EventBus.$on('set-value', (value) => {
        this.valueFather = value;      
    });
  },*/

  mounted(){
  
  },methods:{
      ...mapActions(["addResponse","removeResponse"]),
      setNameInput(val){
          return val.replace(/\W/g, "_").toLowerCase()
      },
      setResponse(option){
         /*const value = this.value;
         this.response = {'name':this.setNameInput(option.option_text),value:value};
         const resp = {};
         resp.data = this.response;
         resp.questionKey = this.questionKey;
         resp.type = option.type;
         if(value.length > 0){
            this.$validator.validate(option.option_text,value).then((result) => {
              if(result){
                this.addResponse(resp);
              }
            });   
         }else{
            this.removeResponse(resp); 
         }*/       
      },
      //crear una expresion vee-validate por json
      setJsonValidate(val){ 
        const filtered = Object.keys(val).filter((key)=>{
            if(val[key]){
                return key;
            }
        })
        return filtered.join('|');
      }
  },
  computed:{
    ...mapGetters([
      'getNumPag',
    ]),
    questionKey(){
      this.getNumPag;
    }
  },
   props: ["option","submitted"],
};
</script>


