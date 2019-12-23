<template>
  <el-row class="survey-section">
    <transition :name="transName()">
      <!-- questionList component (1 per section) -->
      <survey-questions
      v-if="section"
      :sectionId="section.id"
      :ancestors="{'formId': formId}" />
    </transition>
  </el-row>
</template>
<script>
import { mapGetters } from 'vuex'
// , mapState
import QuestionList from '@/components/QuestionList'

export default {
  name: 'Section',
  props: ['section', 'formId'],
  computed: {
    ...mapGetters([
      'sections',
      'direction',
      'currentSection'
    ])
  },
  methods: {
    transName () {
      if (this.direction) {
        return 'fade'
      } else {
        return 'slide-fade'
      }
    }
  },
  mounted () {
    document.body.classList.add('overflow')
  },
  beforeDestroy () {
    document.body.classList.remove('overflow')
  },
  components: {
    'survey-questions': QuestionList
  }
}
</script>

<style>
.survey-section{
  height: auto;
}
.overflow {
}
</style>
