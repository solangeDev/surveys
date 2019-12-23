<template>
  <li v-if="question">
    <question-option
      :question="question"
      :required="question.is_required"
      :questionType="this.questionType"
      :index="index"
      :ancestorIds="{'sectionId': ancestors.sectionId, 'formId': ancestors.formId, 'questionId': question.id}" />
  </li>
  </template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Option from './Option'

export default {
  name: 'Question',
  props: ['question', 'ancestors', 'questions', 'index'],
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'last_answer',
      'sections',
      'rules'
    ]),
    // return the type of the question
    questionType () {
      return this.question.type
    }
  },
  methods: {
    ...mapActions([
      'limitSection',
      'storeRules',
      'storeTotal'
    ])
  },
  components: {
    'question-option': Option
  }
}
</script>
<style lang="scss" scoped>
  li{
    min-height: 100vh;
    padding-top: 120px;
    display: flex;
    align-items: center;
  }
  li.hidden{
    height: 0;
  }
</style>
