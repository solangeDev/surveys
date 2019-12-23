<template>
<div class="section-questions">
  <div class="option-container">
    <el-alert v-show="bannerError"
        title="Please check your answer"
        type="error"
        center
        :closable="false"
        show-icon>
      </el-alert>
        <div class="header-text">
          <h3>{{section.question_text}}</h3>
          <h3 v-if="section.description" class="question-desc">{{section.description}}</h3>
        </div>
        <div v-for="(detail,indice) in section.question_options" :key="indice" class="mb">
              <checkbox :key="detail.option_text" :option="detail" :submited="submited" v-if="detail.type=='multiple-choice-checkbox' || detail.type=='single-choice-checkbox'" />
              
              <!-- <div v-if="detail.type=='text' || detail.type=='number'">
                <el-row class="">
                <p>{{detail.option_text}}</p>
                  <el-col :span="24">
                    <el-input
                      :id="detail.option_text"
                      :key="detail.option_text"
                      :ref="detail.option_text"
                      :disabled="submited"
                      :type="detail.type"
                      :placeholder="(detail.attributes.placeholder)?detail.attributes.placeholder:null"
                      :name="detail.detail"
                      @change="setResponse"
                      v-model="newEntries[this.setNameInput(detail.option_text)]"          
                      />
                  </el-col>
                  <span class="error-msj">{{errors.first(detail.option_text)}}</span>
                </el-row>
              </div> -->
              
              
              <inputOption :key="detail.option_text" :option="detail" v-if="detail.type=='text' || detail.type=='number'" :submited="submited" /> 
              <inputDate :key="detail.option_text" :option="detail" v-if="detail.type=='date'" :submited="submited" :index="indice" />
              <inputAddress :key="detail.option_text" :option="detail" v-if="detail.type=='address'" :submited="submited" />
        </div>
        <button @click="saveForm" v-show="showButton(section.question_options)"  class="el-button el-button--info mt" >Submit</button> 
  </div>
</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import MultipleChoice from './types_data/checkbox';
import TextChoice from './types_data/textchoice';
import inputDate from './types_data/datechoice';
import inputAddress from './types_data/address';
import EventBus from '../bus'


export default {
  components: {
    'checkbox': MultipleChoice,
    'inputOption': TextChoice,
    'inputDate' : inputDate,
    'inputAddress' : inputAddress
  },
  data() {
    return {
      questions: null,
      submited: false,
      error:[],
      sendForm:false,
      is_required:false,
      bannerError : false,
      hideButtonForTypes:['single-choice-checkbox'],

      /* Inputs */
      //newEntries: []
    }
  },
  props: ["section"],
  created() {
    this.questions = this.section;
    EventBus.$on('next-question', () => {
      this.nextQuestionForm()
    });
    
  },
  /**
   * Funcion (error,submited) permiten detectar 
   * cuando el formulario hijo no tiene errores y hace submited
   */
  watch: {
    error: function() {
       if(this.error.length > 0){
         this.submited = false;
       }
    },
    submited: function() {
       if(this.submited){
         this.submited = false;
        this.nextQuestionForm()
       }
    },
  },
  updated(){
    EventBus.$on('show-error', (item) => {
      if(item){
        this.bannerError = false;
      }else{
        this.bannerError = true;
      }
    });
  },
  methods:{
    ...mapActions([
      'nextQuestion',
    ]),
    nextQuestionForm(){
      this.nextQuestion();
      EventBus.$emit('transition')
    },
    showButton(options){
      let filterByOption = options.filter((i)=>{
         if(this.hideButtonForTypes.indexOf(i.type)!= -1){
           return i;
         }
      })
      return filterByOption.length == 0 
    },
    saveForm(){
      this.submited =true;
      const data = this.getPagAct;
      this.is_required = data.is_required;
      if(data.is_required){
        //input-text
        const arrValErrors = data.question_options.filter( (i)=>{
              this.$validator.validate(i.option_text).then((result) => {            
              if(!result){
                return i;
              }
          })
        })
        this.error = this.$validator.errors.items;
      }else{
        //multiple-choice
        if(data.responses.length == 0){
          this.bannerError = true;
          this.error = [...this.error,{"error":"choice"}];
        }else{
          this.bannerError = false;
          this.error.length = 0;
        }
      }
    },
    //globalizar
    /*setNameInput(val) {
      return val.replace(/\W/g, "_").toLowerCase()
    },*/
    setResponse(){
      console.log(this.newEntries)
    }
  },
    computed: {
    ...mapGetters([
      'getPagAct',
    ])
  },
};
</script>