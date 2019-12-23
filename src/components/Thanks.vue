<template>
  <div class="thanks" v-loading.fullscreen="loading" :class="{overflow: !thanks}">
    <div v-if="this.risk_category" class="graph">
      <div class="button-container">
        <el-button icon="el-icon-back" type="info" @click="goBack()">
          Back
        </el-button>
      </div>
      <div>
        <p class="top-info">Based on your responses, which form both your personal risk tolerance and capacity for risk, we believe that your investment risk profile should be:</p>
        <div class="progress">
          <div class="legend-row">
            <div class="legend-node">
              <div class="dot" :class="{'node-active': progress.trim() === 'Risk-averse'}"></div>
              <p :class="{'legend-active': progress.trim() === 'Risk-averse'}">Risk-Averse</p>
            </div>
            <div class="legend-node">
              <div class="dot" :class="{'node-active': progress === 'Cautious'}"></div>
              <p :class="{'legend-active': progress === 'Cautious'}">Cautious</p>
            </div>
            <div class="legend-node">
              <div class="dot" :class="{'node-active': progress === 'Neutral'}"></div>
              <p :class="{'legend-active': progress === 'Neutral'}">Neutral</p>
            </div>
            <div class="legend-node">
              <div class="dot" :class="{'node-active': progress === 'Assured'}"></div>
              <p :class="{'legend-active': progress === 'Assured'}">Assured</p>
            </div>
            <div class="legend-node">
              <div class="dot" :class="{'node-active': progress === 'Risk-taking'}"></div>
              <p :class="{'legend-active': progress === 'Risk-taking'}">Risk-Taking</p>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="blurb">
            <h1 class="score-num">{{trimPoints()}}</h1>
            <p class="score-text">Risk Score</p>
            <p class="score-desc">People with this risk profile tend to have portfolios that resemble the asset mix pictured.</p>
            <router-link :to="{ name: 'method'}" target="_blank">How is your risk score calculated?</router-link>
          </div>
          <div class="donut">
            <canvas id="myChart" ref="chart" width="400" height="400"></canvas>
          </div>
        </div>
        <div class="bottom-blurb">
          <p class="bottom-info">If you had invested <strong>${{drawDowns.assets}}</strong> in a portfolio with this asset mix at the beginning of 2007, at the lowest point in the Financial Crisis, your portfolio would have decreased by <span><strong> ${{drawDowns.range2}} </strong></span> to <strong> ${{drawDowns.range1}}</strong>, and taken <strong> {{textValues.recovery}} months </strong> to recover back to the starting point.</p>
          <p class="returns" @click="expandGraph()">See the chart of investment returns for this portfolio</p>
          <p class="advisor">Your investment advisor will follow up with a more detailed plan for the actual investment and asset mix ranges that will be implemented.</p>
          <h4 class="query">Is this investment portfolio consistent with your expectations?</h4>
          <div class="yes-no">
            <el-button icon="el-icon" type="info" @click="goBack()">
              Yes
            </el-button>
            <el-button icon="el-icon" type="info" @click="disagree">
              No
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="expand-graph" v-show="expand" @click="expand = false">
      <p>click anywhere to exit</p>
      <div class="line-chart chart-container" style="position: relative; height:100vh; width: 85%">
        <canvas id="exChart" :responsive="true"></canvas>
      </div>
    </div>
    <div class="no-graph" v-if="!this.risk_category">
      <div class="button-container">
        <el-button icon="el-icon-back" type="info" @click="goBack()">
          Back
        </el-button>
      </div>
      <div>
        <h2>Thanks!</h2>
        <p>You will be redirected to survey selection in 5 seconds.</p>
      </div>
    </div>
    <div class="disagree" v-if="!thanks">
      <h1>Your Risk Profile</h1>
      <p>You have indicated that the risk profile does not suit your expectations.</p>
      <p>The risk profile discussed is meant to show a representative asset allocation to ensure that you are comfortable with the potential losses associated with that risk profile.  You will still have the opportunity to discuss further with your advisor the precise investment strategies and asset mix to be implemented in your portfolio.</p>
      <p>If you choose to reject this risk profile you can proceed to open accounts and your advisor will be in touch to have a more fullsome conversation about risk and determine an appropriate risk profile for your investment portfolio.</p>
      <p>When the risk profile is confirmed, the advisor will be able to place trades in your account.</p>
      <div class="yes-no">
        <el-button icon="el-icon" type="info" @click="goBack()">
          Reject risk profile
        </el-button>
        <el-button icon="el-icon" type="info" @click="disagree">
          Go back
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import api from '@/env'

// , mapActions
import Chart from 'chart.js'
export default {
  name: 'Thanks',
  data () {
    return {
      expand: false,
      donut: false,
      loading: true,
      thanks: true,
      test: false,
      risk_category: null,
      payload: null
    }
  },
  created () {
    this.test = this.$store.state.survey.participant_token;
    this.loading = true
  },
  async mounted () {
    this.payload = await this.getChartData();
    this.risk_category = this.getRiskCategory();

    if (!this.test) {
      this.$router.push({ path: '/login' })
    } else if (this.risk_category) {
      this.showDonut()
    }
    this.loading = false
    setTimeout(() => {
      if (!this.risk_category) {
        this.$router.push({ path: '/welcome' })
      }
    }, 5000)
  },
  computed: {
    ...mapGetters([
      //'points',
      'getPoints',
      //'access',
      'token',
      //'merge_fields'
      'getdataTags'
    ]),
    progress () {
      if (this.risk_category) {
        let scores = this.risk_category;
        return scores.name
      } else {
        return null
      }
    },
    textValues () {
      if (this.risk_category) {
        let name = this.risk_category.name.trim()
        let riskAverse = {drawDown: 0.9359, recovery: 8}
        let cautious = {drawDown: 0.8817, recovery: 7}
        let neutral = {drawDown: 0.8182, recovery: 13}
        let assured = {drawDown: 0.7567, recovery: 19}
        let riskTaking = {drawDown: 0.6891, recovery: 22}
        if (name === 'Risk-averse') return riskAverse
        if (name === 'Cautious') return cautious
        if (name === 'Neutral') return neutral
        if (name === 'Assured') return assured
        if (name === 'Risk-taking') return riskTaking
      }
    },
    drawDowns () {
      let assets = this.getdataTags['{{LIQUID_ASSETS}}'];
      let range1 = this.textValues.drawDown * assets;
      let drawDowns = {
        assets: assets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        range1: range1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        range2: (assets - range1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      };
      return drawDowns
    }
  },
  methods: {
    ...mapActions(['setPoints']),
    disagree () {
      window.scrollTo(0, 0)
      if (this.thanks) {
        this.thanks = false
      } else {
        this.thanks = true
      }
    },
    showDonut () {
      let data = this.chartData()
      this.$nextTick(() => {
        const ctx = this.$refs.chart;
        const myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Cash', 'Equity', 'Fixed Income'],
            datasets: [{
              data: data,
              backgroundColor: ['#7b99b6', '#204d55', '#C48F39']
            }]
          },
          options: {
          }
        })
        this.loading = false
      });
    },
    goBack () {
      this.$router.push({path: '/welcome'})
    },
    expandGraph () {
      this.expand = true
      let scores = this.risk_category;
      let chartTitle = ''
      let chartData = []
      if (scores.name.trim() === 'Risk-averse') {
        chartTitle = 'Risk-Averse - 80% Bonds, 20% Equity'
        chartData = [100.29, 101.07, 100.95, 101.21, 100.57, 100.02, 99.83, 100.42, 101.18, 101.84, 102.40, 102.87, 102.41, 103.34, 104.39, 104.69, 105.17, 104.36, 104.46, 105.69, 101.62, 98.91, 100.25, 102.22, 100.43, 99.63, 102.51, 103.58, 104.30, 106.08, 107.12, 108.85, 110.22, 109.58, 111.75, 110.90, 111.72, 112.61, 112.63, 112.97, 113.03, 113.74, 115.00, 116.97, 118.63, 119.48, 118.84, 119.88, 119.97, 120.80, 120.72, 121.49, 122.98, 122.34, 123.66, 124.27, 124.93, 125.83, 126.92, 128.52, 130.00, 130.13, 130.21, 130.01, 131.16, 131.67, 132.43, 132.74, 134.21, 134.11, 134.59, 134.86, 135.11, 137.01, 137.83, 138.93, 138.38, 135.71, 136.79, 136.27, 137.16, 139.96, 140.67, 140.83, 144.00, 145.55, 145.63, 146.57, 148.18, 149.16, 150.24, 152.42, 151.28, 152.13, 154.85, 155.68, 162.51, 163.61, 162.85, 160.82, 161.62, 160.15, 163.07, 160.27, 159.19, 160.14, 160.67, 161.94, 161.68, 161.46, 163.66, 163.71, 166.02, 168.32, 170.83, 171.10, 171.65, 169.28, 168.80, 168.80, 168.57, 170.89, 171.72, 174.42, 175.44, 173.07, 170.09, 172.22, 171.25, 175.00, 176.77, 176.13, 175.36, 175.11, 175.79, 174.77, 177.18]
      } else if (scores.name === 'Cautious') {
        chartTitle = 'Cautious- 65% Bonds, 35% Equity'
        chartData = [100.60, 101.00, 100.98, 101.42, 101.39, 100.62, 100.19, 100.60, 101.38, 102.05, 101.91, 102.26, 100.97, 101.56, 102.64, 103.58, 104.53, 103.15, 102.62, 104.21, 98.68, 94.62, 95.06, 96.27, 94.01, 92.17, 95.63, 97.40, 98.69, 100.62, 101.86, 103.76, 105.46, 104.44, 107.00, 106.72, 106.63, 108.01, 108.63, 109.25, 108.40, 108.14, 109.87, 111.50, 113.73, 114.96, 114.83, 116.45, 116.99, 118.19, 118.11, 118.66, 119.85, 118.71, 119.15, 119.11, 118.59, 120.49, 121.57, 122.72, 124.73, 125.32, 125.74, 125.30, 125.27, 126.11, 126.77, 127.37, 129.21, 129.22, 129.43, 130.01, 131.15, 133.40, 134.34, 135.08, 135.60, 133.07, 134.71, 134.40, 135.41, 139.11, 140.54, 141.26, 144.07, 146.40, 146.75, 147.85, 149.33, 150.76, 151.97, 154.60, 153.31, 154.17, 157.19, 158.00, 164.64, 166.77, 165.81, 163.90, 165.06, 163.13, 166.57, 162.84, 161.24, 163.24, 164.07, 164.95, 164.00, 163.33, 166.28, 166.47, 169.44, 171.31, 174.71, 175.07, 175.72, 173.91, 174.50, 175.14, 174.89, 177.84, 178.82, 181.81, 182.51, 179.79, 176.95, 178.95, 178.96, 183.60, 185.75, 185.14, 184.83, 184.18, 184.39, 183.69, 187.00]
      } else if (scores.name === 'Neutral') {
        chartTitle = 'Neutral - 50% Bonds, 50% Equity'
        chartData = [100.29, 101.07, 100.95, 101.21, 100.57, 100.02, 99.83, 100.42, 101.18, 101.84, 102.40, 102.87, 102.41, 103.34, 104.39, 104.69, 105.17, 104.36, 104.46, 105.69, 101.62, 98.91, 100.25, 102.22, 100.43, 99.63, 102.51, 103.58, 104.30, 106.08, 107.12, 108.85, 110.22, 109.58, 111.75, 110.90, 111.72, 112.61, 112.63, 112.97, 113.03, 113.74, 115.00, 116.97, 118.63, 119.48, 118.84, 119.88, 119.97, 120.80, 120.72, 121.49, 122.98, 122.34, 123.66, 124.27, 124.93, 125.83, 126.92, 128.52, 130.00, 130.13, 130.21, 130.01, 131.16, 131.67, 132.43, 132.74, 134.21, 134.11, 134.59, 134.86, 135.11, 137.01, 137.83, 138.93, 138.38, 135.71, 136.79, 136.27, 137.16, 139.96, 140.67, 140.83, 144.00, 145.55, 145.63, 146.57, 148.18, 149.16, 150.24, 152.42, 151.28, 152.13, 154.85, 155.68, 162.51, 163.61, 162.85, 160.82, 161.62, 160.15, 163.07, 160.27, 159.19, 160.14, 160.67, 161.94, 161.68, 161.46, 163.66, 163.71, 166.02, 168.32, 170.83, 171.10, 171.65, 169.28, 168.80, 168.80, 168.57, 170.89, 171.72, 174.42, 175.44, 173.07, 170.09, 172.22, 171.25, 175.00, 176.77, 176.13, 175.36, 175.11, 175.79, 174.77, 177.18]
      } else if (scores.name === 'Assured') {
        chartTitle = 'Assured - 35% Bonds, 65% Equity'
        chartData = [100.29, 101.07, 100.95, 101.21, 100.57, 100.02, 99.83, 100.42, 101.18, 101.84, 102.40, 102.87, 102.41, 103.34, 104.39, 104.69, 105.17, 104.36, 104.46, 105.69, 101.62, 98.91, 100.25, 102.22, 100.43, 99.63, 102.51, 103.58, 104.30, 106.08, 107.12, 108.85, 110.22, 109.58, 111.75, 110.90, 111.72, 112.61, 112.63, 112.97, 113.03, 113.74, 115.00, 116.97, 118.63, 119.48, 118.84, 119.88, 119.97, 120.80, 120.72, 121.49, 122.98, 122.34, 123.66, 124.27, 124.93, 125.83, 126.92, 128.52, 130.00, 130.13, 130.21, 130.01, 131.16, 131.67, 132.43, 132.74, 134.21, 134.11, 134.59, 134.86, 135.11, 137.01, 137.83, 138.93, 138.38, 135.71, 136.79, 136.27, 137.16, 139.96, 140.67, 140.83, 144.00, 145.55, 145.63, 146.57, 148.18, 149.16, 150.24, 152.42, 151.28, 152.13, 154.85, 155.68, 162.51, 163.61, 162.85, 160.82, 161.62, 160.15, 163.07, 160.27, 159.19, 160.14, 160.67, 161.94, 161.68, 161.46, 163.66, 163.71, 166.02, 168.32, 170.83, 171.10, 171.65, 169.28, 168.80, 168.80, 168.57, 170.89, 171.72, 174.42, 175.44, 173.07, 170.09, 172.22, 171.25, 175.00, 176.77, 176.13, 175.36, 175.11, 175.79, 174.77, 177.18]
      } else if (scores.name === 'Risk-taking') {
        chartTitle = 'Risk-Taking -20% Bonds, 80% Equity'
        chartData = [100.29, 101.07, 100.95, 101.21, 100.57, 100.02, 99.83, 100.42, 101.18, 101.84, 102.40, 102.87, 102.41, 103.34, 104.39, 104.69, 105.17, 104.36, 104.46, 105.69, 101.62, 98.91, 100.25, 102.22, 100.43, 99.63, 102.51, 103.58, 104.30, 106.08, 107.12, 108.85, 110.22, 109.58, 111.75, 110.90, 111.72, 112.61, 112.63, 112.97, 113.03, 113.74, 115.00, 116.97, 118.63, 119.48, 118.84, 119.88, 119.97, 120.80, 120.72, 121.49, 122.98, 122.34, 123.66, 124.27, 124.93, 125.83, 126.92, 128.52, 130.00, 130.13, 130.21, 130.01, 131.16, 131.67, 132.43, 132.74, 134.21, 134.11, 134.59, 134.86, 135.11, 137.01, 137.83, 138.93, 138.38, 135.71, 136.79, 136.27, 137.16, 139.96, 140.67, 140.83, 144.00, 145.55, 145.63, 146.57, 148.18, 149.16, 150.24, 152.42, 151.28, 152.13, 154.85, 155.68, 162.51, 163.61, 162.85, 160.82, 161.62, 160.15, 163.07, 160.27, 159.19, 160.14, 160.67, 161.94, 161.68, 161.46, 163.66, 163.71, 166.02, 168.32, 170.83, 171.10, 171.65, 169.28, 168.80, 168.80, 168.57, 170.89, 171.72, 174.42, 175.44, 173.07, 170.09, 172.22, 171.25, 175.00, 176.77, 176.13, 175.36, 175.11, 175.79, 174.77, 177.18]
      }
      var etx = document.getElementById('exChart')
      // eslint-disable-next-line
      var exChart = new Chart(etx, {
        type: 'line',
        data: {
          labels: [
            '2006-12-31', '2007-01-31', '2007-02-28', '2007-03-31', '2007-04-30', '2007-05-31', '2007-06-30', '2007-07-31', '2007-08-31', '2007-09-30', '2007-10-31', '2007-11-30', '2007-12-31', '2008-01-31', '2008-02-29', '2008-03-31', '2008-04-30', '2008-05-31', '2008-06-30', '2008-07-31', '2008-08-31', '2008-09-30', '2008-10-31', '2008-11-30', '2008-12-31', '2009-01-31', '2009-02-28', '2009-03-31', '2009-04-30', '2009-05-31', '2009-06-30', '2009-07-31', '2009-08-31', '2009-09-30', '2009-10-31', '2009-11-30', '2009-12-31', '2010-01-31', '2010-02-28', '2010-03-31', '2010-04-30', '2010-05-31', '2010-06-30', '2010-07-31', '2010-08-31', '2010-09-30', '2010-10-31', '2010-11-30', '2010-12-31', '2011-01-31', '2011-02-28', '2011-03-31', '2011-04-30', '2011-05-31', '2011-06-30', '2011-07-31', '2011-08-31', '2011-09-30', '2011-10-31', '2011-11-30', '2011-12-31', '2012-01-31', '2012-02-29', '2012-03-31', '2012-04-30', '2012-05-31', '2012-06-30', '2012-07-31', '2012-08-31', '2012-09-30', '2012-10-31', '2012-11-30', '2012-12-31', '2013-01-31', '2013-02-28', '2013-03-31', '2013-04-30', '2013-05-31', '2013-06-30', '2013-07-31', '2013-08-31', '2013-09-30', '2013-10-31', '2013-11-30', '2013-12-31', '2014-01-31', '2014-02-28', '2014-03-31', '2014-04-30', '2014-05-31', '2014-06-30', '2014-07-31', '2014-08-31', '2014-09-30', '2014-10-31', '2014-11-30', '2014-12-31', '2015-01-31', '2015-02-28', '2015-03-31', '2015-04-30', '2015-05-31', '2015-06-30', '2015-07-31', '2015-08-31', '2015-09-30', '2015-10-31', '2015-11-30', '2015-12-31', '2016-01-31', '2016-02-29', '2016-03-31', '2016-04-30', '2016-05-31', '2016-06-30', '2016-07-31', '2016-08-31', '2016-09-30', '2016-10-31', '2016-11-30', '2016-12-31', '2017-01-31', '2017-02-28', '2017-03-31', '2017-04-30', '2017-05-31', '2017-06-30', '2017-07-31', '2017-08-31', '2017-09-30', '2017-10-31', '2017-11-30', '2017-12-31', '2018-01-31', '2018-02-28', '2018-03-29', '2018-04-30', '2018-05-31'
          ],
          datasets: [{
            label: chartTitle,
            data: chartData,
            borderWidth: 5,
            pointRadius: 0,
            fill: false,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            borderColor: '#C48F39',
            backgroundColor: '#C48F39'
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false,
                max: 200,
                min: 80
              },
              stacked: true
            }]
          }
        }
      })
    },
    chartData () {
      let riskAverse = [1, 19.5, 79.5]
      let cautious = [1, 34.5, 64.5]
      let neutral = [1, 49.5, 49.5]
      let assured = [1, 64.5, 34.5]
      let riskTaking = [1, 79.5, 19.5]
      let name = this.risk_category.name.trim()
      if (name === 'Risk-averse') return riskAverse
      if (name === 'Cautious') return cautious
      if (name === 'Neutral') return neutral
      if (name === 'Assured') return assured
      if (name === 'Risk-taking') return riskTaking
    },
    trimPoints () {
      if (this.risk_category) {
        return this.getFinalScores().toFixed(1)
      }
    },
    getChartData () {
      const uniqueCode = this.$store.state.login.unique_code;
      const surveyId = this.$store.state.survey.survey_id;
      const accessCode = this.$store.state.survey.access_code;
      const participantToken = this.$store.state.survey.participant_token;
      const firm = this.$store.state.login.firm;

      return axios({
        method: 'POST',
        url: `${api.endpoint}/form/submitRiskSurvey`,
        headers: {
          'app-id': api.priv['app-id'],
          'app-secret': api.priv['app-secret'],
          'access-code': accessCode,
          'participant-token': participantToken,
          'firm': firm
        },
        data: {
          survey_id: surveyId,
          unique_code: uniqueCode
        }
      }).then(response => response.data.payload)
    },
    getRiskCategory () {
      return this.payload.risk_category.risk_category;
    },
    getFinalScores () {
      return this.payload.risk_category.risk_scores.final_scores;
    }
  }
}
</script>