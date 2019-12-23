<template>
  <ul class="section-questions">
    <!-- individual questions list rendered -->
    <question
    v-for="(question, key) in questions"
    :key="key"
    :question="question"
    :questions="questions"
    :ancestors="{'sectionId': sectionId, 'formId': ancestors.formId}" />
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Question from './Question'

export default {
  name: 'QuestionList',
  props: ['sectionId', 'ancestors'],
  data () {
    return {
      questions: null
    }
  },
  async created () {
    // fetch questions from questions endpoint
    try {
      let questionParams = {
        'section_id': this.sectionId,
        'access_code': this.$route.params.access_code,
        'survey_id': this.$route.params.survey_id,
        'token': this.token,
        'form_id': this.ancestors.formId,
        'participant_id' : this.$route.params.participant_id,
        'participant_token' : this.$route.params.participant_token
      }
      if (this.sectionId === 212 || this.sectionId === 229) {
        questionParams = {
          'section_id': this.sectionId,
          'access_code': this.$route.params.access_code,
          'survey_id': this.$route.params.survey_id,
          'token': this.token,
          'custom_condition': {
            'retired_age': 65 - this.merge_fields['{{AGE}}']
          }
        }
      }
      // lo nuevo por implementar
      await this.setFormTemplate(questionParams)
      let questions = this.setFormatQuestions(questionParams)
      await this.initQuestions(questions)
      this.questions = questions
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'rules',
      'sections',
      'merge_fields',
      'currentSection',
      'getState',
    ])

  },
  methods: {
    setFormatQuestions (questionParams) {
      let sections = this.$store.state.form.template.form.section;
      let questions = sections
      .filter(function (obj) {
        return obj.id == questionParams.section_id && obj.form_id == questionParams.form_id;
      })
      .map(function (obj) {  
        let options = obj.question[0].question_options;
        options.sort((a,b)=>{
          if (a.sort_order > b.sort_order) {
            return 1;
          }
          if (a.sort_order < b.sort_order) {
            return -1;
          }
          return 0;
        })
        return obj.question[0];
      });

      
      return questions;
    },
    ...mapActions([
      'initQuestions',
      'setSections',
      'setSectionIndex',
      'setFormTemplate'
    ]),
    filtered (questions) {
      if (questions) {
        return questions.map(question => {
          let sectionIndex = this.sections.findIndex(x => x.id === this.sectionId)
          let newSection = this.sections[sectionIndex]
          if (question.is_hidden === 1) { // if is_hidden is 1, go on
            if (question.rules.length > 0) { // if there's rules, go on
              var localRules = question.rules.map(a => a.question_option_id)
              let found = localRules.some(x => {
                // console.log(x)
                return this.rules.includes(x)
              })
              if (!found) {
                newSection.hidden = false
                this.setSectionIndex({
                  index: sectionIndex,
                  section: newSection
                })
                return question
              } else {
                newSection.hidden = true
                this.setSectionIndex({
                  index: sectionIndex,
                  section: newSection
                })
                return question
              }
            } else {
              newSection.hidden = false
              this.setSectionIndex({
                index: sectionIndex,
                section: newSection
              })
              return question
            }
          } else {
            newSection.hidden = false
            this.setSectionIndex({
              index: sectionIndex,
              section: newSection
            })
            return question
          }
        })
      }
    }
  },
  components: {
    'question': Question
  }
}
</script>

<style>
</style>
