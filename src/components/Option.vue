<template>
  <div
    class="option-container"
    :key="currentSection"
    v-if="this.question && form !== []">
    <el-alert v-if="error === true"
      title="Please check your answer"
      type="error"
      center
      :closable="false"
      show-icon>
    </el-alert>
    <div class="header-text">
      <h3 :class="{hidden: submitted}">{{calcMergeInto(mergeQuestion())}}</h3>
      <h3 v-if="question.description" class="question-desc" :class="{hidden: submitted}">{{question.description}}</h3>
    </div>
    <el-row class="checkbox-row" v-if="questionType === 'dynamic-form'">
      <div class="dynamic-form"  v-for="(item,key) in dataClient" :key="key" :clientid="item.client_details[0].id">
        <h3 class="question-desc">{{item.client_details[0].display_name}}</h3>
        <div><input type="text" class="el-input__inner input_porcen" :name="'valuepor_'+key" :ref="'valuepor_'+key"   placeholder="%"></div>
      </div>
    </el-row>
    <!-- Form Dynamic Relationships -->
    <el-row class="checkbox-row" v-if="questionType === 'client-form'">
      <div v-for="(item,key) in dataClient" :key="key" :clientid="item.client_details[0].id" :ref="'formrelations_'+key">
      <template v-if="step==key">
        <h3 class="title_form">{{item.client_details[0].display_name}}</h3>
        <div>
          <input type="text" :value="item.client_details[0].display_name" class="el-input__inner mb" :name="'firstname_'+key" :ref="'firstname_'+key" placeholder="First Name">
        </div>
        <div>
          <input type="text" class="el-input__inner mb" :name="'middlename_'+key" :ref="'middlename_'+key"  placeholder="Middle Name(s)">
        </div>
        <div>
          <input type="text"  class="el-input__inner mb" :name="'lastname_'+key" :ref="'lastname_'+key" placeholder="Last Name">
        </div>
        <div>
          <input type="text"  :value="(item.client_details[1])?item.client_details[1].person_details[0].SIN:null" :ref="'sinnumber_'+key"  class="el-input__inner mb" :name="'sinnumber_'+key"  placeholder="SIN Number">
        </div>
        <div>
          <el-date-picker
          :ref = "'datebirth_'+key"
          :name="'datebirth_'+key"
          :placeholder="'Date of Birth'"
          :picker-options="filterDate"
          :disabled="submitted"
          type="date"
          :editable="false"
          format="yyyy/MM/dd"
          v-model="FormBirthday[key].birth" />
        </div>
        <div class="mt">
          <input type="checkbox" :name="'primaryguardian_'+key" :ref="'primaryguardian_'+key" value="true" > Is the subscriber <b>{{item.client_details[0].display_name}}</b> primary guardian?
        </div>
        </template>
      </div>
    </el-row>
    <!-- single -->
    <el-checkbox v-if="questionType === 'single' || questionType ==='dynamic-single'"
      class="single"
      border
      :disabled="submitted"
      v-for="(option, key) in newOptions"
      :key="key"
      @change="submitSingle(key, option.option_text)"
      v-model="form[key].option_value">
    <span>{{option.option_text}}</span>
    </el-checkbox>
    <!-- checkbox -->
    <el-row class="checkbox-row" v-if="questionType === 'multiple'  || questionType === 'dynamic-multiple'">
      <el-col :span="24">
        <el-checkbox
        border
        :disabled="submitted"
        v-for="(option, key) in newOptions"
        :key="key"
        v-model="form[key].option_value">
          {{option.option_text}}
        </el-checkbox>
      </el-col>
    </el-row>
    <!-- other -->
    <div v-if="questionType === 'others'">
      <el-row
      class="others-container"
      v-for="(option, key) in newOptions"
      v-if="option.type !== 'drag-input' && option.type !== 'sort-input'"
      :key="key">
        <el-row v-if="option.type === 'address'" class="address">
          <gmap-autocomplete ref="mapAutoComplete" class="mapInput" :disabled="submitted" :selectFirstOnEnter=
            'true' placeholder='Address Line 1'
            v-model="mapData.address1"
            @place_changed='setPlace' @keyup.enter='setPlace'>
            </gmap-autocomplete>
          <el-input class="mapPad" :disabled="submitted" v-model="mapData.address2" placeholder='Address Line 2'></el-input>
          <el-input class="mapPad" :disabled="submitted" v-model="mapData.city" placeholder='City'></el-input>
          <el-input class="mapPad" :disabled="submitted" v-model="mapData.province" placeholder='Province'></el-input>
          <el-input class="mapPad" :disabled="submitted" v-model="mapData.postal" placeholder='Postal Code'></el-input>
          <el-input class="mapPad" :disabled="submitted" v-model="mapData.country" placeholder='Country'></el-input>
        </el-row>
         
        <el-col v-if="option.type === 'dropdown' && key === newOptions.findIndex(x => x.type === 'dropdown')">
          <p :class="{hidden: submitted}">Select from dropdown</p>
          <el-select :ref="'select_'+option.id" :id="'select_'+option.option_id"
          @change="updateDropdown"
          :disabled="submitted"
          v-model="dropdownDisplay">
            <el-option
              v-for="(option, key) in newOptions.filter(x => x.type === 'dropdown')"
              :key="key"
              :label="option.option_text"
              :value="option.option_text">
            </el-option>
          </el-select>
        </el-col>

        <el-radio
        v-if="option.type === 'single-choice'"
        border
        :disabled="submitted"
        :label="option.option_text"
        v-model="form[key].option_value">
        </el-radio>
        <el-col :span="24" v-if="option.type === 'autocomplete'">
          <div class="mb-autocomplete">
            <autocomplete
              :placeholder="dataAutocomplete.placeholder"
              :source="dataAutocomplete.data"
               @selected="valueSelectedAutocomplete"
               >
            </autocomplete>
          </div>
        </el-col>
        <!-- pendioente -->
        <el-col :span="24" v-if="option.type === 'file'">
          <div class="">
              <file-upload :url='url' :thumb-url='thumbUrl' :headers="headers" @change="onFileChange"></file-upload>
          </div>
        </el-col>
        <el-col :span="24" v-if="option.type === 'multiple-choice' || option.type === 'multiple-values'">
          <el-checkbox
          border
          :disabled="submitted"
          :label="option.option_text"
          v-model="form[key].option_value">
          </el-checkbox>
        </el-col>
        <el-col :span="24" v-if="option.type === 'number'">
          <p :class="{hidden: submitted}">{{option.option_text}}</p>
          <el-input
          v-if="option.merge_field && option.merge_field.includes('SSN')"
          :disabled="submitted"
          placeholder="464-54-2865"
          type="text"
          v-mask="'###-##-####'"
          clearable
          v-model="form[key].option_value" />
          <el-input
          v-else-if="option.merge_field && option.merge_field.includes('SIN')"
          :disabled="submitted"
          placeholder="046-454-286"
          type="text"
          v-mask="'###-###-###'"
          clearable
          v-model="form[key].option_value" />
          <el-input
          v-else-if="option.validation.includes('percentage')"
          :disabled="submitted"
          placeholder="percent"
          type="number"
          min="0"
          max="100"
          clearable
          v-model="form[key].option_value" />
          <el-input
          v-else
          :disabled="submitted"
          :placeholder="option.placeholder || option.option_text"
          type="number"
          clearable
          v-model="form[key].option_value" />
          <!-- <el-input
          v-if="option.merge_field === '{{DEPENDENTS}}' || option.merge_field === '{{SPOUSE_SHAREHOLDER_PERCENT}}' || option.merge_field === '{{SHAREHOLDER_PERCENT}}' || option.merge_field === '{{SHOW_NUMBER}}'"
          :disabled="submitted"
          :placeholder="option.option_text"
          type="number"
          clearable
          v-model="form[key].option_value" />
          <el-input
          v-else
          :disabled="submitted"
          placeholder="046-454-286"
          type="text"
          v-mask="'###-###-###'"
          clearable
          v-model="form[key].option_value" /> -->
        </el-col>
        <el-col :span="24" v-if="option.type == 'text'">
          <p :class="{hidden: submitted}">{{option.option_text}}</p>
          <el-input
          :disabled="submitted"
          :placeholder="option.option_text"
          type="text"
          clearable
          v-model="form[key].option_value" />
        </el-col>
        <el-col :span="24" v-if="option.type == 'text-event'">
          <p :class="{hidden: submitted}">{{option.option_text}}</p>
          <el-input
          @blur="eventInput"
          :disabled="submitted"
          :placeholder="option.option_text"
          type="text"
          clearable
          v-model="form[key].option_value" />
          <div class="msj-input-event" v-show="dataTextEvent.msj">{{dataTextEvent.msj}}</div>
        </el-col>
        <el-col :span="24" v-if="option.type === 'textarea'">
          <el-input
          :disabled="submitted"
          :placeholder="option.option_text"
          type="textarea"
          autosize
          v-model="form[key].option_value" />
        </el-col>
        <el-col :span="24" class="mt" v-if="option.type === 'date'">
          <p :class="{hidden: submitted}">{{option.option_text}}</p>
          <el-date-picker
          :placeholder="option.option_text"
          :picker-options="filterDate"
          :disabled="submitted"
          type="date"
          :editable="false"
          format="yyyy/MM/dd"
          v-model="form[key].option_value" />
        </el-col>
        <el-col :span="24" v-if="option.type === 'datetime'">
          <p :class="{hidden: submitted}">{{option.option_text}}</p>
          <el-date-picker
          :placeholder="option.option_text"
          :disabled="submitted"
          :editable="false"
          v-model="form[key].option_value" />
        </el-col>
        <el-col :span="24" v-if="option.type === 'image'">
          <el-input
          :placeholder="option.option_text"
          :disabled="submitted"
          type="text"
          v-model="form[key].option_value" />
        </el-col>
        <el-col :span="24" v-if="option.type === 'encrypted'">
          <el-input
          :placeholder="option.option_text"
          :disabled="submitted"
          type="password"
          v-model="form[key].option_value" />
        </el-col>
        <div class="other-slider" v-if="option.type === 'range-slider'">
          <div class="slider-inputs-wrap">
            <el-slider
            show-input
            :step="parseInt(validation.breakpoints)"
            :min="parseInt(validation.min)"
            :max="parseInt(validation.max)"
            :disabled="submitted || swapSlider(form[key].option_value)"
            :show-input-controls="false"
            v-model="form[key].option_value" />
            <!-- <el-input
            type="text"
            :disabled="submitted || swapSlider(form[key].option_value)"
            @input.native="(e) => {form[key].option_value = Number(e.target.value.replace(/\D/g, ''))}"
            :value="maskedCurrency(key)"
            :min="parseInt(validation.min)"
            :max="parseInt(validation.max)" /> -->
          </div>
          <el-input
          type="text"
          ref="extraSlider"
          v-if="swapSlider(form[key].option_value)"
          v-money="moneyConfig"
          :disabled="submitted"
          placeholder="Enter value here"
          v-model="extraSlider" />
        </div>
        <el-col :span="24" class="phone" v-if="option.type === 'phone-number'">
          <p :class="{hidden: submitted}">{{option.option_text}}</p>
          <el-input
          :disabled="submitted"
          :placeholder="option.option_text"
          v-mask="'###-###-####'"
          v-model="form[key].option_value.number" />
          <input
          type="checkbox"
          class="primary-radio"
          name="is_primary"
          :id="'primary' + key"
          :disabled="submitted"
          @change="handlePhone(option, form[key])"
          v-model="form[key].option_value.is_primary" />
          <label :class="{hidden: submitted}" class="primary-checkbox" :for="'primary' + key">Primary number</label>
        </el-col>
        <el-row v-if="option.type === 'range-text'" class="range-text">
          <el-col :span="3">
            <label :class="{hidden: submitted}" :for="key">Min</label>
          </el-col>
          <el-col :span="21">
            <el-input
            :disabled="submitted"
            :placeholder="option.option_text"
            type="text"
            :name="key"
            v-model="form[key].option_value" />
          </el-col>
          <el-col :span="3">
            <label :class="{hidden: submitted}" :for="key + 1">Max</label>
          </el-col>
          <el-col :span="21">
            <el-input
            :disabled="submitted"
            :placeholder="option.option_text"
            type="text"
            :name="key + 1"
            v-model="form[key + 1].option_value" />
          </el-col>
        </el-row>
      </el-row>
      <div v-if="question">
        <el-row v-if="question.options[0].type === 'sort-input'">
          <draggable v-model="form" @start="drag=true" @end="drag=false">
            <transition-group>
              <el-card class="drag-card" v-for="option in form" :key="option.option_id">{{option.option_value.value}} <i class="el-icon-rank"/></el-card>
            </transition-group>
          </draggable>
        </el-row>
      </div>
      <el-row>
        <!-- <el-col :span="24" v-for="(option, key) in newOptions" :key="key" v-if="option.type === 'dropdown' && key === newOptions.findIndex(x => x.type === 'dropdown')">
          <p :class="{hidden: submitted}">Select from dropdown</p>
          <el-select :ref="'select_'+option.id" :id="'select_'+option.option_id"
          @change="updateDropdown"
          :disabled="submitted"
          v-model="dropdownDisplay">
            <el-option
              v-for="(option, key) in newOptions.filter(x => x.type === 'dropdown')"
              :key="key"
              :label="option.option_text"
              :value="option.option_text">
            </el-option>
          </el-select>
        </el-col> -->
      </el-row>
    </div>
    <el-row class="submit-row" v-if="questionType !== 'dynamic-form' && questionType !== 'single' && questionType!='dynamic-single' && questionType !== 'client-form'">
      <el-button
      :type="buttonSuccess[0]"
      :disabled="submitted"
      @click="submitQuestion(questionType)"
      native-type="submit"
      :icon="buttonSuccess[1]">
        {{buttonSuccess[2]}}
      </el-button>
    </el-row>
    <el-row class="submit-row" v-if="questionType == 'dynamic-form'">
      <button class="el-button el-button--info" @click="nextFormBenef">Submit</button>
    </el-row>
    <!-- Form Dynamic Relationships -->
    <el-row class="submit-row" v-if="questionType == 'client-form'">
      <button class="el-button el-button--info" v-show="step>0" @click="backFormDynamic">Back</button>
      <button class="el-button el-button--info" @click="nextFormDynamic">Next</button>
    </el-row>
    <div>
      <div v-for="test in test">{{test.name}}</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// mapState,
import draggable from 'vuedraggable'
import moment from 'moment'
import {mask} from 'vue-the-mask'
import {VMoney} from 'v-money'
import Autocomplete from 'vuejs-auto-complete'
import FileUpload from 'v-file-upload'

export default {
  name: 'Question-Option',
  props: ['question', 'questionType', 'isHidden', 'ancestorIds', 'toSubmit', 'required', 'index'],
  components: {
    draggable,
    Autocomplete,
    FileUpload,
  },
  directives: {
    mask,
    money: VMoney
  },
  data () {
    return {
      moneyConfig: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        suffix: '',
        precision: 0,
        masked: false /* doesn't work with directive */
      },
      extraSlider: '',
      singleClick: false,
      rules: [],
      dropdown: null,
      dropdownDisplay: null,
      hasCalc: false,
      error: null,
      sortArray: [],
      inputVal: [],
      form: [],
      submitted: false,
      dataReady: false,
      validation: {},
      editted: false,
      whichMerge: [],
      whichMergeOption: null,
      newOptions: [],
      phoneData: null,
      mapData: {
        address1: null,
        address2: null,
        city: null,
        postal: null,
        country: null,
        province: null,
        province_short: null,
        place_id: null
      },
      birth_form:[],
      filterDate: {
        disabledDate (time) {
          return time.getTime() > Date.now() || time.getFullYear() < 1900
        }
      },
      /****** Form Dynamic Relationships ******/
      step : 0,
      dataClient : null,
      dataFormRelationships : [],
      FormBirthday : [],
      /* Autocomplete */
      dataAutocomplete:{
        placeholder:null,
        data:[],
        selected:null
      },
      /* Text-Event */
      dataTextEvent : {
        source : null,
        value : null,
        method : null,
        text:null,
        msj:null,
      },
      /* Input File */
      url: 'http://your-post.url',
      headers: {'access-token': '<your-token>'},
      filesUploaded: [],
      test:[]
    }
  },
  watch: {
    currentSection () {
      this.mergeOptions()
    },
    done () {
      this.storeTotal()
      this.submitted = true
      this.clearCount()
    }
  },
   mounted () {
    this.inputVal = this.sections.map(() => '')
    this.mergeOptions()
    this.form = this.newOptions.map((option, index) => {
      let adminPlaceholder = ''
      if (option.attributes && option.attributes.placeholder) {
        adminPlaceholder = option.attributes.placeholder
      }
      let newInput = {
        attributes: adminPlaceholder,
        id: this.question.id,
        type: option.type,
        option_text: option.old_option_text,
        option_id: option.option_id,
        merge_field: option.merge_field,
        option_value: undefined,
        validation: option.validation
      }
      if (option.type === 'sort-input') {
        newInput.option_value = option.option_text
        newInput.fixed = false
        let newObj = {
          value: option.option_text,
          sort_order: index
        }
        newInput.option_value = newObj
      } else if (option.type === 'phone-number') {
        let newObj = {
          number: '',
          is_primary: false
        }
        newInput.option_value = newObj
        
      }
      
      if (!option.option_value) {
        if (option.type === 'dropdown') {
          newInput.option_value = false
        }
        if (option.type === "multiple-choice" || option.type === 'single-choice') {     
          if (option.option_value === undefined) {
            newInput.option_value = false
          } else {
            newInput.option_value = option.option_value
          }
        }

        let optionPopulated = option.column_value_option;
        let indexPopulated = optionPopulated.value;
        let typeOption = option.type;
        let valOptionPopulated = null;
        switch (typeOption) {
          case "single-choice":
          case "multiple-choice":
            let valtoCompare = null;
            if(optionPopulated.is_compared == 1){
               valtoCompare = optionPopulated.value_to_compare;
               valtoCompare = this.filerValueClient(valtoCompare);
               //conditions for newStructure merge_fields 
               if(indexPopulated.indexOf("[")!=-1){ 
                  indexPopulated = this.filerValueClient(indexPopulated);
               }
               if(valtoCompare == indexPopulated && valtoCompare!=false){
                 newInput.option_value = true
               }
            }else{
              if(option.option_text==indexPopulated){
                newInput.option_value = true
              }
            }
          break; 
          case "dropdown":
          case "address":
            // console.log(option);
          break;
          case "phone-number":
            valOptionPopulated= this.filerValueClient(indexPopulated);
            newInput.option_value.number = valOptionPopulated;
          break;
          case "number":
          case "text":
          case "date":
             if(indexPopulated!="[]"){
              valOptionPopulated = this.filerValueClient(indexPopulated);
              newInput.option_value=valOptionPopulated;   
             }
          break;
          /*case "multiple-values":
            
          break;*/
        }
        //borrar
        /* if (option.merge_field !== '[{}]' && option.merge_field !== '' && option.merge_field !== 'null' && option.merge_field !== null) {
          console.log("aqui");
          if (option.merge_field === '{{DOB}}') {
            newInput.option_value = moment(this.merge_fields[option.merge_field]).toDate()
          } else if (option.type === 'phone-number') {
            let merge = this.merge_fields[option.merge_field]
            if (merge) {
              newInput.option_value.number = merge.number
              newInput.option_value.is_primary = JSON.parse(merge.is_primary)
            }
            // console.log(newInput.option_value.is_primary)
          } else if (option.type === 'text') {
            let merge = this.merge_fields[option.merge_field]
            if (merge) {
              newInput.option_value = merge
            }
          } else if (option.type === 'address') {
            let merge = this.merge_fields[option.merge_field]
            if (merge) {
              this.mapData.address1 = merge.address1
              this.mapData.address2 = merge.address2
              this.mapData.city = merge.city
              this.mapData.province = merge.province
              this.mapData.province_short = merge.province_short
              this.mapData.country = merge.country
              this.mapData.place_id = merge.place_id
              this.mapData.postal = merge.postal
            }
          } else {
            if (!isNaN(this.merge_fields[option.merge_field]) && option.type !== 'phone-number') {
              newInput.option_value = Number(this.merge_fields[option.merge_field])
            } else {
              if (this.merge_fields[option.merge_field]) {
                if (newInput.type === 'multiple-choice') {
                  newInput.option_value = JSON.parse(this.merge_fields[option.merge_field])
                } else if (newInput.type === 'single-choice') {
                  let field = this.merge_fields[option.merge_field].toLowerCase().trim()
                  // eslint-disable-next-line
                  let optionField = option.merge_field.trim()
                  let text = option.old_option_text.toLowerCase().trim()
                  if (field === text) {
                    newInput.option_value = true
                  } else {
                    newInput.option_value = false
                  }
                }
              }
            }
          }
        } */
      } else {
        if (option.type === 'single-choice') {
          if (option.option_value) {
            newInput.option_value = true
          } else {
            newInput.option_value = false
          }
        } else if (option.type === 'multiple-choice') {
          if (option.option_value) {
            newInput.option_value = true
          } else {
            newInput.option_value = false
          }
        } else if (option.type === 'range-slider') {
          newInput.option_value = Number(option.option_value)
        } else if (option.type === 'dropdown') {
          this.dropdown = this.newOptions.findIndex(x => x.option_id === option.option_id)
          this.dropdownDisplay = this.newOptions[this.dropdown].option_text
        } else if (option.type === 'sort-input') {
          newInput.option_value = option.option_value
        } else if (option.type === 'phone-number') {
          newInput.option_value = option.option_value
        } else if (option.type !== 'single-choice') {
          newInput.option_value = option.option_value
        }
      }

      return newInput
    })
    if (this.form[0].type === 'sort-input') {
      this.form.sort(function (a, b) {
        return a.option_value.sort_order - b.option_value.sort_order
      })
    }
    if (this.question.options[0].type === 'range-slider') {
      let smallInput = document.getElementsByClassName('el-input__inner')
      setTimeout(() => {
        smallInput[0].type = 'number'
      }, 5)
    }
  },
  computed: {
    hasMerge () {
      let fields = []
      let options = this.question.options
      for (let i = 0; i < options.length; i++) {
        fields.push(options[i].merge_field)
      }
      return fields
    },
    toNumber (value) {
      return parseInt(value)
    },
    buttonSuccess () {
      if (this.submitted) {
        return ['info', 'el-icon-check', 'Submitted']
      } else {
        return ['info', '', 'Submit']
      }
    },
    ...mapGetters([
      'sections',
      'token',
      'currentSection',
      'last_answer',
      'to_submit',
      'submitted_num',
      'unique_code',
      'merge_fields',
      'currentIndex',
      'done',
      'filerValueClient',
      'searchDataFormDynamic'
    ])
  },
  created () {
    this.validation = JSON.parse(this.question.options[0].validation)
  },
  methods: {
    saveForm(formQuestion){
      const answer = {
          token: this.token,
          access_code: this.$route.params.access_code,
          unique_code: this.unique_code,
          survey_id: this.$route.params.survey_id,
          section_id: this.question.section_id,
          questions: formQuestion,
          merge_fields: this.hasMerge
        }
        this.initAnswer(answer)
        this.changeDirection(true)
        this.goNextSection()
        this.error = false
    },
    /********** Form Dynamic Beneficiaries ***********/
    nextFormBenef(){
      let objForm = [];
      this.dataClient.map((i,key)=>{
         let resp = {};
         let obj = {};
         resp.id = i.client_details[1].person_details[0].client_id
         resp.value = this.$refs[`valuepor_${key}`][0].value
         obj.option_value = JSON.stringify(resp);
         obj.option_id = i.client_details[1].person_details[0].client_id;
         obj.section_id = this.question.section_id;
         obj.id = this.question.id;
         objForm = [...objForm,obj]
      })
      this.saveForm(objForm)
    },
     /********** Input File ***********/
    nextFormFile(){
      this.changeDirection(true)
          setTimeout(() => {
            this.goNextSection()
          }, 100)
    },
    thumbUrl (file) {
      return file.myThumbUrlProperty
    },
    onFileChange (file) {
      // Handle files like:
      this.fileUploaded = file
    },
    /********** Input Event Blur ***********/
    eventInput(event){
      const valueInput = event.path[0].value;
      if(this.dataAutocomplete.selected){
        this.dataTextEvent.value = valueInput;
        let bodyFormData = new FormData();
        bodyFormData.append("institution_no",this.dataAutocomplete.selected.id);
        bodyFormData.append("transit_no",this.dataAutocomplete.selected.transit_no );
        this.dataTextEvent.parameters = bodyFormData;
        this.getAxiosAutocomplete(this.dataTextEvent);
      }
    },
    /********** Data Autocomplete ***********/
    valueSelectedAutocomplete(data){
       this.dataAutocomplete.selected = data.selectedObject;
    },
    async getAxiosAutocomplete(param){
      let data = await this.getDataAutocomplete(param);
      switch (param.text) {
         case "autocomplete-institutions":
           const dataAuto = data.data.results.map((i)=>{
                let newObj = {}
                newObj.name = `${i.bank_name} - ${i.transit_no}`
                newObj.id = i.institution_no
                newObj.transit_no = i.transit_no
                return newObj
           })
           this.dataAutocomplete.data = dataAuto;
         break;
         case "text-event-transit-no":
            this.dataTextEvent.msj = data.data.etf.etf.address_1;
         break;
       }
    },
    /**** Form Dynamic Relationships ******/
    backFormDynamic() {
      if(this.step!=0){
        this.step--;
      }
    },
    nextFormDynamic(){
      const total = (this.dataClient.length)-1;
      let obj = {};
      obj.id = this.$refs[`formrelations_${this.step}`][0].getAttribute("clientid");
      obj.firstname = this.$refs[`firstname_${this.step}`][0].value;
      obj.middlename = this.$refs[`middlename_${this.step}`][0].value;
      obj.lastname = this.$refs[`lastname_${this.step}`][0].value;
      obj.sinnumber = this.$refs[`sinnumber_${this.step}`][0].value;
      obj.datebirth = this.$refs[`datebirth_${this.step}`][0].value;
      obj.primaryguardian = false;
      if(this.$refs[`primaryguardian_${this.step}`][0].checked){
        obj.primaryguardian = true;
      }
      this.dataFormRelationships.push(obj);
      this.step++;
      if(this.step == total+1){
        let a = [];
        this.dataFormRelationships.forEach((i)=>{
            let obj = {};
            obj.option_value = JSON.stringify(i);
            obj.option_id = i.id;
            obj.section_id = this.question.section_id;
            obj.id = this.question.id;
            a = [...a,obj];
        })
        this.saveForm(a)
        /*const answer = {
          token: this.token,
          access_code: this.$route.params.access_code,
          unique_code: this.unique_code,
          survey_id: this.$route.params.survey_id,
          section_id: this.question.section_id,
          questions: a,
          merge_fields: this.hasMerge
        }
        this.initAnswer(answer)
        this.changeDirection(true)
        this.goNextSection()
        this.error = false*/
      }
    },
    /*************  ****************/
    maskedCurrency (key) {
      const formatted = this.form[key].option_value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -3)
      return `$ ${formatted}`
    },
    ...mapActions([
      'initAnswer',
      'storeSubmit',
      'clearCount',
      'storeTotal',
      'rmRule',
      'setCurrentSection',
      'goNextSection',
      'changeDirection',
      'getDataAutocomplete'
    ]),
    sliderInput (input) {
      return input
    },
    swapSlider (input) {
      if (this.validation.max === input) {
        return true
      } else {
        return false
      }
    },
    updateDropdown (val) {
      this.dropdown = this.newOptions.findIndex(x => x.option_text === val)
    },
    handlePhone (option, form) {
      let matchId = option.option_id
      if (form) {
        this.form.forEach((q) => {
          if (q.option_id !== matchId) {
            q.option_value.is_primary = false
          }
        })
      }
    },
    submitSingle (key, name) {
      this.form = this.form.map((x, i) => {
        if (i === key) {
          x.option_text = name
          x.option_value = true
          return x
        } else {
          x.option_value = false
          return x
        }
      })
      this.submitQuestion()
    },
    calcMergeInto (q) {
      if (q) {
        let matches = []
        matches = q.match(/\[{2}.*?\]{2}/g)
        if (matches) {
          let cleanMatches = []
          for (let i = 0; i < matches.length; i++) {
            let index = q.indexOf(matches[i])
            let slice = q.slice(index + 2, index + matches[i].length - 2)
            // eslint-disable-next-line
            let calcd = Math.round(eval(slice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            cleanMatches.push(calcd)
          }
          let finalQ = null
          for (let i = 0; i < cleanMatches.length; i++) {
            if (finalQ !== null) {
              finalQ = finalQ.replace(matches[i], cleanMatches[i])
            } else {
              finalQ = q.replace(matches[i], cleanMatches[i])
            }
          }
          return finalQ
        } else if (matches === null) {
          return q
        }
      } else {
        return q
      }
    },
    mergeOptions () {
        // preload values and generate dynamic v-model for question
        let indexMapping = this.question.options[0].column_value_option.value; 
        switch(this.questionType){
          case "dynamic-form":
             switch(indexMapping){
              /**** Form Dynamic Beneficiaries ******/
              case "['form_relationships']":
                this.dataClient = this.searchDataFormDynamic(indexMapping);
              break;
            }
          break;
          /**** Multiple-Values Dynamic ******/
          case "dynamic-multiple":         
              switch (indexMapping) {
                case "['relationships']":
                  indexMapping = this.filerValueClient(indexMapping);
                  this.question.options = indexMapping.map((element)=>{
                    let obj = {};
                    obj.participant_response = this.question.options[0].participant_response;
                    obj.column_value_option = this.question.options[0].column_value_option;
                    obj.merge_field = null;
                    obj.old_option_text = element.client_details[0].display_name;
                    obj.option_text = element.client_details[0].display_name;
                    obj.option_id = element.client_details[0].id;
                    obj.id = element.client_details[0].id;
                    obj.validation = this.question.options[0].validation;
                    obj.type =  this.question.options[0].type;
                    obj.placeholder = null;
                    obj.value = JSON.stringify({name:element.client_details[0].display_name,id:element.client_details[0].id});
                    return obj;
                  })
                break;
              }
          break;
           /**** Simple-Values Dynamic  ******/
          case "dynamic-single":
            switch (indexMapping) {
                case "['Client_Banking_Info']":
                  indexMapping = this.filerValueClient(indexMapping);
                  let values =  indexMapping.map((i)=>{
                    let obj = {};
                    obj.participant_response = this.question.options[0].participant_response;
                    obj.column_value_option = this.question.options[0].column_value_option;
                    obj.merge_field = null;
                    obj.old_option_text = i.account_no;
                    obj.option_text = i.account_no;
                    obj.option_id = i.id;
                    obj.id = i.id;
                    obj.validation = this.question.options[0].validation;
                    obj.type =  this.question.options[0].type;
                    obj.placeholder = null;
                    obj.value =  JSON.stringify({account_no:i.account_no,id:i.id});
                    return obj;
                  })
                  let obj = {};
                  obj.participant_response = undefined;
                  obj.column_value_option = {};
                  obj.merge_field = null;
                  obj.old_option_text = "Add Another Bank Account";
                  obj.option_text = "Add Another Bank Account";
                  obj.option_id = 0;
                  obj.id = 0;
                  obj.validation = null;
                  obj.type =  this.question.options[0].type;
                  obj.placeholder = null;
                  obj.value = "Add Another Bank Account";
                  values = [...values,obj];
                  this.question.options = values;
                break;
              }
          break;
          case "others":
            indexMapping = this.filerValueClient(indexMapping);
            this.question.options.map((i)=>{
              if(i.type=="autocomplete"){
                let param = JSON.parse(i.column_value_option.value);
                if(param.text=="autocomplete-institutions"){
                  this.dataAutocomplete.placeholder = param.placeholder;
                  this.getAxiosAutocomplete(param);
                }
              }else if(i.type == "text-event"){
                let param = JSON.parse(i.column_value_option.value);
                if(param.text=="text-event-transit-no"){
                   this.dataTextEvent.source = param.source;
                   this.dataTextEvent.method = param.method;
                   this.dataTextEvent.text = param.text;
                }
              }
            })
          break;
          case "client-form":
            switch(indexMapping){
              /**** Form Dynamic Relationships ******/
              case "['form_relationships']":
                const form_id = this.$store.state.form.template.form.id;
                this.dataClient = this.searchDataFormDynamic(indexMapping);
                this.dataClient.map((i,key)=>{
                  let dataBirth = (i.client_details[1])?i.client_details[1].person_details[0].date_of_birth:null
                  this.FormBirthday = [...this.FormBirthday,{birth:dataBirth}];
                })
              break;
            }
          break;
          
        }
        /**************              *************/       
        var options = this.question.options.map((a, index) => {         
        let optionText = a.option_text
        let adminPlaceholder = ''
        if (a.attributes && a.attributes.placeholder) {
          adminPlaceholder = a.attributes.placeholder
        }
      
        let newObj = {
          old_option_text: a.option_text,
          option_text: this.calcMergeInto(optionText),
          option_id: a.id,
          type: a.type,
          merge_field: a.merge_field,
          placeholder: adminPlaceholder,
          validation: a.validation,
          value:a.value,
        }

        if (a.type === 'dynamic-options') {
          if (this.merge_fields[a.option_text]) {
            let tag = this.merge_fields[a.option_text]
            optionText = tag.options
            tag.options.forEach(x => {
              let field = x.option_value.slice(x.option_value.indexOf('{{'), x.option_value.indexOf('}}') + 2)
              this.newOptions.push({
                attributes: adminPlaceholder,
                old_option_text: a.option_text,
                option_text: x.option_value.replace(field, this.merge_fields[field]),
                option_id: a.id,
                type: a.type,
                merge_field: a.merge_field,
                validation: a.validation
              })
            })
          }
        }else if (a.type=="multiple-values"){
          if(a.participant_response!=undefined){
            a.participant_response.filter((index)=>{
              if(index.option_id == a.option_id ){
               newObj.option_value = true
              }
            })
          }
        } else {
          if (this.merge_fields) {
            let matches = []
            for (let field in this.merge_fields) {
              if (a.option_text.indexOf(field) !== -1) {
                matches.push(field)
              }
            }
            let newText = a.option_text
            matches.forEach((match) => {
              if (match === '{{NET_ASSETS}}' && this.merge_fields['{{NET_ASSETS}}'] <= 0) {
                newText = newText.replace(match, this.merge_fields['{{GROSS_ASSETS}}']).replace(match, this.merge_fields['{{GROSS_ASSETS}}']).replace(match, this.merge_fields['{{GROSS_ASSETS}}'])
              } else {
                newText = newText.replace(match, this.merge_fields[match]).replace(match, this.merge_fields[match]).replace(match, this.merge_fields[match])
              }
            })
            optionText = newText.replace('married', 'partner')
          }
        }
      
        if (a.participant_response && a.participant_response.option_value !== ' ') {
          if (a.type === 'phone-number') {
            let phone = JSON.parse(a.participant_response.option_value)
            newObj.option_value = phone
          } else if (a.type === 'number' || a.type === 'range-slider') {
            newObj.option_value = a.participant_response.option_value
          } else if (a.type === 'address') {
            let address = JSON.parse(a.participant_response.option_value)
            this.mapData = address
            newObj.option_value = address.address1
          } else if (a.type === 'date') {
            newObj.option_value = moment(a.participant_response.option_value).toDate()
          } else if (a.type === 'dropdown') {
            if (a.participant_response.option_value === 'true') {
              this.question.options.forEach((o, index) => {
                if (o.id === a.participant_response.option_id) {
                  this.dropdown = index
                  this.dropdownDisplay = newObj.option_text
                }
              })
            }
          } else if (a.type === 'sort-input') {
            newObj.option_value = JSON.parse(a.participant_response.option_value)
          } else if (a.type === 'text') {
            newObj.option_value = a.participant_response.option_value
          } else if (a.type === 'single-choice') {
            if (a.participant_response.option_value !== 'false') {
              newObj.option_value = true
            } else {
              newObj.option_value = false
            }
          } else if (a.type === 'multiple-choice') {
            if (a.participant_response.option_value !== 'false') {
              newObj.option_value = true
            } else {
              newObj.option_value = false
            }
          }
        } else if (a.type === 'sort-input') {
          newObj.option_value = {
            value: newObj.option_text,
            sort_order: index
          }
        } else if (a.participant_response && a.participant_response.option_value === ' ') {
          // newObj.option_value = undefined
        }
        newObj.column_value_option=a.column_value_option;
        return newObj
      })
      
      if (this.newOptions.length === 0) {
        this.newOptions = options
        return
      }
      return this.newOptions
    },
    mergeQuestion () {
      let matches = []
      let q = this.question.question_text
      for (let field in this.merge_fields) {
        if (q.indexOf(field) !== -1) {
          matches.push(field)
        }
      }
      matches.forEach((match) => {
        // match is {{MERGEFIELDNAME}},
        // Temp code: sorry, please fix.
        if (match === '{{MARITAL_STATUS}}' && this.merge_fields[match] === 'married') {
          q = q.replace(match, 'partner')
        } else if (match === '{{NET_ASSETS}}' && this.merge_fields['{{NET_ASSETS}}'] <= 0) {
          q = q.replace(match, this.merge_fields['{{GROSS_ASSETS}}']).replace(match, this.merge_fields['{{GROSS_ASSETS}}']).replace(match, this.merge_fields['{{GROSS_ASSETS}}'])
        } else if (match === '{{AGE}}' && this.merge_fields['{{AGE}}'] >= 65 && this.question.id === 465) {
          q = 'Based on your age, in the near future do you expect to:'
          // q = q.replace(match, this.merge_fields["{{GROSS_ASSETS}}"]).replace(match, this.merge_fields["{{GROSS_ASSETS}}"]).replace(match, this.merge_fields["{{GROSS_ASSETS}}"])
        }
        q = q.replace(match, this.merge_fields[match]).replace(match, this.merge_fields[match]).replace(match, this.merge_fields[match]).replace(match, this.merge_fields[match])
      })
      return q
    },
    addPrimary (key) {
      this.form[key].option_value.is_primary = true
    },
    setPlace (place) {
      if (this.mapData) {
        this.mapData = {
          address1: null,
          address2: null,
          city: null,
          postal: null,
          country: null,
          province: null,
          province_short: null,
          place_id: null
        }
      }
      let cat = this.mapData
      cat.address1 = place.name
      // reverse order of array so sublocality (higher precision)
      // overrides locality (lower precision)
      let reverseOrder = place.address_components
      reverseOrder.forEach(component => {
        const type = component.types
        const name = component.long_name
        const short = component.short_name
        if (type.includes('country')) cat.country = name
        else if (type.includes('administrative_area_level_1')) {
          cat.province = name
          cat.province_short = short
        } else if (type.includes('postal_code') || type.includes('postal_code_prefix')) cat.postal = name
        else if (type.includes('locality') && type.includes('political')) cat.city = name
        else if (type.includes('locality') && type.includes('political')) cat.city = name
      })
      this.mapData.place_id = place.place_id
    },
    submitId (id) {
      this.submitQuestion()
    },
    async submitQuestion () {
      this.submitted = true
      this.error = false
      // eslint-disable-next-line
      let questionId = this.$props.ancestorIds.questionId
      let sectionId = this.$props.ancestorIds.sectionId
      // eslint-disable-next-line
      let formId = this.$props.ancestorIds.formId
      let newForm = JSON.parse(JSON.stringify(this.form))
      //Validations for dynamic options.
      let validFormDynamic = false;
      let sendFormDynamic = false;
    
      let qBundle = newForm.filter((q, index) => {
        
        if(q.type=="file"){
          this.error = false;
          this.changeDirection(true)
          setTimeout(() => {
            this.goNextSection()
          }, 100)
        }
        
        //Validations for dynamic options.
        //se asigno en el option_value el valor dinamico creado en la fn mergeOptions
        //para las opciones dinamicas.   
        if(q.type=="autocomplete"){
          if(this.dataAutocomplete.selected){
            q.option_value=JSON.stringify(this.dataAutocomplete.selected);
            this.error = false
            return q;
          }
        }
        if(q.type == 'multiple-values'){
           
           validFormDynamic = true;
           let a = [];
           this.newOptions.forEach((i)=>{
              if(i.option_id==q.option_id){
                if(q.option_value == true){
                   q.option_value=i.value;
                   a.push(index);
                }
              }
           }); 
           if(a.length > 0){
             sendFormDynamic = true;
           }

        }
        
        if (q.option_value ||  q.option_value === false || q.option_value === 0 || this.mapData.address1) {
          if (q.type === 'single-choice') {
            if(this.question.type != "dynamic-single"){
               if (q.option_value === false) {
                  q.option_value = q.option_value.toString()
                } else {
                  q.option_value = q.option_text
                }
                return q
            }else{
              this.newOptions.forEach((i)=>{
                  if(i.option_id==q.option_id){
                    if(q.option_value == true){
                      q.option_value=i.value;
                    }else{
                      q.option_value = "false";
                    }
                  }
              }); 
               return q
            }
           
          }
          else if (q.type === 'multiple-choice') {
            let testArray = []
            newForm.forEach((a) => {
              if (a.option_value && a.option_value !== 'false') {
                testArray.push(a)
              }
            })
            if (testArray.length === 0) {
              this.error = true
              this.submitted = false
            } else {
              q.option_value = q.option_value.toString()
            }
            return q
          } else if (q.type === 'date') {
            let old = moment('Sun Jan 1 1900 00:00:00 GMT-0400 (Eastern Daylight Time)').format()
            q.option_value = moment(q.option_value).format().toString()
            if (old > q.option_value) {
              this.error = true
              this.submitted = false
            }
            return q
          } else if (q.type === 'number') {
            if (q.validation.includes('percentage')) {
              if (q.option_value < 0 || q.option_value > 100) {
                this.submitted = false
                this.error = true
              }
            }
            if (q.option_value.toString().length === 11) {
              if (q.merge_field.includes('SIN')) {
                let sin = q.option_value.replace(/-/g, '').toString()
                function validateSIN (sin) {
                  var check, even, tot
                  if (typeof sin === 'number') {
                    sin = sin.toString()
                  }
                  if (sin.length === 9) {
                    // convert to an array & pop off the check digit
                    sin = sin.split('')
                    check = +sin.pop()

                    even = sin
                      // take the digits at the even indices
                      .filter(function (_, i) { return i % 2 })
                      // multiply them by two
                      .map(function (n) { return n * 2 })
                      // and split them into individual digits
                      .join('').split('')

                    tot = sin
                      // take the digits at the odd indices
                      .filter(function (_, i) { return !(i % 2) })
                      // concatenate them with the transformed numbers above
                      .concat(even)
                      // it's currently an array of strings; we want numbers
                      .map(function (n) { return +n })
                      // and take the sum
                      .reduce(function (acc, cur) { return acc + cur })

                    // compare the result against the check digit
                    return check === (10 - (tot % 10)) % 10
                    // eslint-disable-next-line
                  } else throw sin + ' is not a valid sin number.'
                }
                if (validateSIN(sin)) {
                  q.option_value = sin
                } else {
                  this.submitted = false
                  this.error = true
                }
                return q
              } else if (q.merge_field.includes('SSN')) {
                let ssn = q.option_value
                if (typeof ssn === 'number') {
                  ssn = ssn.toString()
                }
                let regexp = /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/
                if (regexp.test(ssn)) {
                  ssn = q.option_value.replace(/-/g, '').toString()
                  q.option_value = ssn
                  return q
                } else {
                  this.submitted = false
                  this.error = true
                }
              }
            } else {
              if (q.option_value >= 0) {
                // check that it follows regex/ if it has a decimal, that decimal has something before it, and no decimal after it
                // q.validation if includes: 'percentage' or 'currency' or 'plain'
                return q
              } else {
                this.submitted = false
                this.error = true
              }
            }
          } else if (q.type === 'dropdown') {
            if (this.dropdownDisplay) {
              return q
            } else {
              this.error = true
              this.submitted = false
            }
          } else if (q.type === 'phone-number') {
            let hasNumber
            this.form.forEach((item) => {
              if (item.option_value.number && item.option_value.number.length === 12) {
                hasNumber = true
              }
            })
            if (!hasNumber) {
              this.error = true
              this.submitted = false
            } else {
              if (q.option_value.number) {
                q.option_value.number = q.option_value.number.replace('-', '').replace('-', '')
                q.option_value = JSON.stringify(q.option_value)
                return q
              }
            }
          } else if (q.type === 'range-slider') {
            if (this.extraSlider) {
              let cleanVal = this.extraSlider.replace(/,/g, '').replace('$', '')
              if (cleanVal < 0) {
                this.submitted = false
                this.error = true
              }
              q.option_value = cleanVal
              return q
            } else {
              let smValue = document.getElementsByClassName('el-input__inner')[0].value
              if (smValue < 0) {
                this.submitted = false
                this.error = true
              }
              if (q.option_value >= 0) {
                q.option_value = q.option_value.toString()
              } else {
                this.submitted = false
                this.error = true
              }
              return q
            }
          } else if (q.type === 'address') {
            let mapOb = {
              address1: this.mapData.address1,
              address2: this.mapData.address2,
              city: this.mapData.city,
              province: this.mapData.province,
              province_short: this.mapData.province_short,
              postal: this.mapData.postal,
              country: this.mapData.country,
              place_id: this.mapData.place_id
            }
            if (!mapOb.address1 || !mapOb.country) {
              this.error = true
              this.submitted = false
            } else {
              q.option_value = JSON.stringify(mapOb)
            }
            return q
          } else if (q.type === 'text') {
            if (q.option_value) {
              return q
            } else if (q.merge_field === '{{MIDDLE_NAME}}' || q.merge_field === '{{SPOUSE_MIDDLE_NAME}}') {
              return q
            } else {
              this.error = true
              this.submitted = false
            }
          } else if (q.option_value && q.type !== 'dropdown') {
            return q
          }
           
        } else {
            if(q.type !== 'multiple-values'){
              if (q.merge_field === '{{MIDDLE_NAME}}' || q.merge_field === '{{SPOUSE_MIDDLE_NAME}}') {
                return q
              } else if (q.type !== 'dropdown') {
                this.error = true
              }
              this.submitted = false
            }
        }
      })

      if(validFormDynamic==true && sendFormDynamic==false){
        this.error = true
        this.submitted = false
      }

      if (this.dropdown || this.dropdown >= 0) {
        let dropdown = this.newOptions
        dropdown.forEach((x, i) => {
          // delete x.merge_field
          x.id = this.question.id
          if (i === this.dropdown && x.type === 'dropdown') {
            x.option_value = 'true'
            qBundle.push(x)
          } else {
            x.option_value = 'false'
          }
        })
      }
      if (!this.error) {
        try {
          let answer = {
            token: this.token,
            access_code: this.$route.params.access_code,
            unique_code: this.unique_code,
            survey_id: this.$route.params.survey_id,
            section_id: sectionId,
            questions: [...qBundle],
            merge_fields: this.hasMerge
          }
          await this.initAnswer(answer)
          // this.submitted = true
          this.changeDirection(true)
          setTimeout(() => {
            this.goNextSection()
          }, 100)
          this.error = false;
        } catch (error) {
          this.submitted = false
          this.error = true
          console.log(error)
        }
      }
    },
    editResponse () {
      // eslint-disable-next-line
      let index = this.sections.findIndex(x => {
        return (x.id === this.question.id)
      })
      // this.setCurrentSection()
      this.submitted = false
      this.editted = true
    },
    async skipQuestion () {
      try {
        this.storeTotal()
        // this.submitted = true
        await this.clearCount()
        this.changeDirection(true)
        setTimeout(() => {
          this.goNextSection()
        }, 100)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#survey .el-row.others-container {
  margin: 0;
  width: 100%;
}
p {
  margin: .25em 0;
  text-align: left;
  font-size: 80%;
  color: #515a69;
}
.option-container{
  width: 100%;
  text-align: center;
  height: 100%;
  .header-text{
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: left;
    position: relative;
    padding-bottom: 1.5em;
    h3{
      text-align: left;
      margin-bottom: 0;
    }
    .question-desc{
      text-align: left;
      font-weight: 100;
      font-size: 80%;
    }
  }
  .button-row{
    width: 100%;
  }
  .submit-row {
    width: 100%;
    padding-top: 1em;
  }
  .hidden{
    color: darkgrey;
  }
  label{
    line-height: 1.8;
  }
  .el-button--text{
    color: #303640;
  }
  .address{
    margin: 0;
  }
  .mapInput{
    font-size: 14px;
    border: 1px solid #dcdfe6;
    width: 100%;
    border-radius: 4px;
    margin-bottom: 1em;
    padding: 10px;
    line-height: 1.3;
    text-align: left;
    transition: .2s;
    &::placeholder{
      color: #c0c4cc;
    }
    &:hover{
      border-color: #c0c4cc;
    }
  }
  .mapPad{
    margin-bottom: 1em;
  }
  .mapInput:disabled {
    background: #f5f7fa;
    color: #c0c4cc;
  }
}

.others-container .el-input{
  margin-bottom: 1em;
}
.drag-card.el-card{
  margin-bottom: .5em;
  font-weight: normal;
  position: relative;
  i{
    position: absolute;
    right: 10px;
    top: 12px;
  }
  &:hover{
    cursor: pointer;
  }
}

div.other-slider{
  padding-left: 0px;
}
.el-select{
  text-align: left;
  width: 100%;
}
// stuff to do with eleme.io that I wouldn't mess with much
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
  text-align: left;
}
label.el-radio, label.el-radio.el-radio.is-bordered{
  padding-left: 1em;
}
.el-radio.is-bordered + .el-radio.is-bordered{
  margin-left: 0;
  padding-left: 1em;
  height: unset;
}
.el-radio{
  margin-bottom: 1em;
  padding-left: .5em;
  height: unset;
  width: 100%;
  margin-right: 1em;
  display: block;
}
label.el-radio{
  padding: 5px 0;
  padding-right: 20px;
  margin-left: 0;
  white-space: normal;
  width: 100%;
  background-color: white;
}
.el-radio-group{
  width: 100%;
}
.el-checkbox{
  white-space: unset;
}
.el-checkbox.is-bordered{
  margin-bottom: 1em;
  margin-right: 1em;
  width: 100%;
  height: unset;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered{
  margin-left: 0;
  margin-right: 1em;
  max-width: 100%;
  height: unset;
  margin-bottom: 1em;
  color: #303640;
  .el-checkbox__label{
    white-space: wrap;
    max-width: 100%;
  }
}
.phone{
  width: 100%;
  text-align: left;
  padding-left: 1px;
  padding-bottom: 10px;
  .el-input{
    margin-bottom: 10px;
  }
  label{
    padding-left: 10px;
    line-height: 1.2;
    font-size: 80%;
  }
}
.sort-input{
  display: flex;
  align-items: center;
  .el-input{
    width: 3em;
    text-align: left;
    margin-right: 1em;
  }
  label{
    text-align: left;
  }
}
.other-slider{
  width: 100%;
}
.el-slider{
  margin-bottom: 1em;
}
.range-text .el-input{
  margin-bottom: 1.5em;
}
#survey .range-text{
  margin-bottom: 0;
}
#survey .checkbox-row, #survey .range-text{
  margin-top: 0px;
}

.mb{
  margin-bottom: 10px;
}

.mt{
  margin-top: 10px;
}

.title_form{
  text-align: left;
  margin-top: 0;
}

.mb-autocomplete{
  margin-bottom: 10px;
}

.msj-input-event{
  font-size: 12px;
  text-align: left;
  margin-top: -10px;
  color:red;
}

/* (node_modules) v-file-upload.js */
.file-upload .input-wrapper{
  background-color: transparent !important;
  border: 1px solid #C48F39;
  border-radius: 15px;
}

.file-upload .input-wrapper .file-upload-label{
  color: #C48F39;
}

.file-upload .input-wrapper:hover {
    background-color: #f3f1ee;
}

.dynamic-form{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input_porce{
  width: 10rem;
}

// .slider-inputs-wrap{
//   width: 100%;
//   // display: flex;
// }
// .slider-inputs-wrap > .el-input{
//   width: 130px;
//   position: relative;
// }
// .slider-inputs-wrap > .el-slider{
//   width: calc(100% - 150px);
//   display: inline-block;
//   margin-bottom: 0 !important;
// }
</style>