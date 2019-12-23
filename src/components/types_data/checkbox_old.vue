<template>
  <div>
    <el-row class="checkbox-row">
      <el-col :span="24">
        <el-checkbox
          :ref="option.option_text"
          :class="{'is-checked':showClass}"
          border
          :label="option.option_text"
          :disabled="submited"
          @change="toggleChoice(option)"
          v-model="valueChoice"
        ></el-checkbox>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from '../../bus'

export default {
  name: 'MultipleChoice',
  data() {
    return {
      valueChoice: null,
      response: {},
      showClass:false,
    };
  },
  updated(){
    //this.showclassChecked();
  },
  mounted(){
    this.showclassChecked();
  },
  methods: {
    showclassChecked(){
      //console.log(this.responses);
      this.responses.filter((i)=>{
        if(i.value == this.option.option_text){
          this.showClass = true;
          this.valueChoice = true;
        }
      })
    },
    ...mapActions(["addResponse","removeResponse","nextQuestion"]),
    toggleChoice(option) {           
      const obj = {};
      const resp = {};
      obj.value = option.option_text;
      this.response = obj;
      resp.data = this.response;
      resp.type = option.type;
      if(option.type == "single-choice-checkbox"){
          if(this.valueChoice == true){
            setTimeout(() => {
              this.valueChoice = false;
            },250)
            this.addResponse(resp);
            this.nextQuestion()
            //EventBus.$emit('next-question',this.valueChoice)  
          }
      }else if(option.type == "multiple-choice-checkbox"){
        if(this.valueChoice == true){
          EventBus.$emit('show-error',true) 
          this.showClass = true;
          this.addResponse(resp);
        }else{
          this.showClass = false;
          this.removeResponse(resp); 
        }
      }
      
    }
  },
  computed:{
    ...mapGetters([
      'getNumPag',
      //'getResponseData'
    ]),
  },
  props: ["option", "submited", "error", "responses"]
};
</script>

