<template>
    <div>
    <el-row class="checkbox-row">
      <p>{{option.option_text}}</p>
      <el-col :span="24">
       <money 
        v-bind="money"
        :id="option.option_text"
        :key="option.option_text"
        :ref="option.option_text"
        :disabled="submited"
        :type="option.type"
        :placeholder="(option.attributes.placeholder)?option.attributes.placeholder:null"
        :name="option.attributes.key_validate"
        class="el-input__inner"
        v-model="proxyValue"
        v-validate="setJsonValidate(option.validation)"
       /> 
      </el-col>
     <span class="error-msj">{{errors.first(option.attributes.key_validate)}}</span>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "../../bus";
import {Money} from 'v-money'

  export default {
    components: {Money},
    data () {
      return {
        price: 0,
        money: {
          decimal: ',',
          thousands: '.',
          prefix: '$ ',
          suffix: '',
          precision: 2,
          masked: false
        }
      }
    },
    mounted() {
        this.price = this.option.value;
    },
    updated() {
        this.price = this.option.value;
    },
    created() {
        if(this.option.value == null){
            this.option.value = 0;
        }
        this.price = this.option.value;
        EventBus.$on("set-value", value => {
            value.forEach(element => {
                if (this.option.option_text == element.name) {
                this.$emit("input", element.value);
                }
            });
        });
    },
    methods: {
        setJsonValidate(val) {
        const filtered = Object.keys(val).filter(key => {
            if (val[key]) {
            return key;
            }
        });
        return filtered.join("|");
        }
    },
    computed: {
    proxyValue: {
        get() {
            return this.price;
        },
        set(newValue) {
            this.price = newValue;
            this.$emit("input", newValue);
        }
    }
    },
    props: ["option", "submited"]
  }
</script>
