<template>
  <div :class="'form-' + form_id" class="form" v-loading.fullscreen="loading">
    <!-- sections are list rendered -->
    <survey-section
    v-if="!done"
    :section="current"
    :formId="form_id"/>
    <!-- conditional button to submit the complete survey -->
    <transition name="fade">
      <el-row id="complete" class="final-submit" v-if="done === true && currentSection > 0">
        <div>
          <h3>Survey complete! Click to submit.</h3>
          <el-button type="info" icon="el-icon-check" @click="thanks()">Submit Survey</el-button>
        </div>
      </el-row>
    </transition>
    <el-button @click="goToPrevSection()" class="scroll-button" size="small" icon="el-icon-arrow-up" type="info" v-if="!this.done" round>Prev</el-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// , mapState
import Section from '@/components/Section'

export default {
  name: 'Form',
  props: ['access_code', 'form_id', 'survey_id', 'complete'],
  data () {
    return {
      current: null,
      loading: false
    }
  },
  watch: {
    currentSection (val) {
      this.current = null
      setTimeout(() => {
        this.current = this.sections[val]
      }, 200)
    }
  },
  async created () {
    this.loading = false
    // if there's no token go to /login to get one
    if (!this.form_id) {
      this.$router.push({ path: '/login' })
    }
    this.clearCurrentSection()
    try {
      let sectionData = {
        form_id: this.$route.params.form_id,
        access_code: this.$route.params.access_code,
        participant_token: this.token
      }
      await this.initSections(sectionData)
      this.current = JSON.parse(JSON.stringify(this.currentSection))
    } catch (error) {
      console.log(error)
    }
  },
  mounted () {
    this.loading = false
  },
  computed: {
    ...mapGetters([
      'unique_code',
      'sections',
      'token',
      'current_section',
      'progress',
      'total_submitted',
      'currentSection',
      'done'
    ])
  },
  methods: {
    ...mapActions([
      'initForm',
      'initSections',
      'initReset',
      'clearCurrentSection',
      'goPrevSection',
      'initResults',
      'changeDirection'
    ]),
    goToPrevSection () {
      this.changeDirection(false)
      setTimeout(() => {
        this.goPrevSection()
      }, 100)
    },
    // make an object with params for survey_submit endpoint, pass it to <thanks>
    async thanks () {
      try {
        let thanksData = {
          token: this.token,
          access_code: this.$route.params.access_code,
          survey_id: this.$route.params.survey_id,
          unique_code: this.unique_code
        }
        this.loading = true
        await this.initResults(thanksData)
        this.$router.push({ name: 'thanks' })
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    }
  },
  components: {
    'survey-section': Section
  }
}
</script>

<style lang="scss" scoped>
// submit button when flow ends
.final-submit{
  height: 100vh;
  align-items: center;
  justify-content: center;
  display: flex;
  text-align: center;
}
.scroll-button{
  position: fixed;
  right: 5vmin;
  bottom: 10vmin;
}
</style>
