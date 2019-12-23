import {
  Validator
} from 'vee-validate';
import moment from 'moment'

const phonenumber_lenght = 12;
const years_old_valid = 18;

Validator.extend('validsin', {
  getMessage: field => 'The ' + field + ' value is not valid.',
  validate: (value) =>{
    let sin = value.replace(/-/g, '').toString()
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
       .filter(function (_, i) {
         return i % 2
       })
       // multiply them by two
       .map(function (n) {
         return n * 2
       })
       // and split them into individual digits
       .join('').split('')
     tot = sin
       // take the digits at the odd indices
       .filter(function (_, i) {
         return !(i % 2)
       })
       // concatenate them with the transformed numbers above
       .concat(even)
       // it's currently an array of strings; we want numbers
       .map(function (n) {
         return +n
       })
       // and take the sum
       .reduce(function (acc, cur) {
         return acc + cur
       })

     // compare the result against the check digit
     return check === (10 - (tot % 10)) % 10
    }else{
      return false;
    }
  }
});

Validator.extend('validphone', {
  getMessage: field => 'The ' + field + ' phone number is not valid.',
  validate: (value) => {
    if (value.length == 0 || value.length == phonenumber_lenght){
      return true;
    } else if (value.length < phonenumber_lenght){
      return false;
    }
  }
});

Validator.extend('validyears', {
  getMessage: field => 'The date of birth value is not valid.',
  validate: (value) => {
    if (value != "Invalid date"){
      const val_set = moment(value, "lll").format('YYYY-MM-DD')
      const age = moment().diff(val_set, 'years', false);
      if (age >= years_old_valid) {
        return true;
      }else{
        return false;
      }
    } else {
      return true;
    }
  }
});

Validator.extend('valid_postal_code', {
  getMessage: field => 'The ' + field + ' value is not valid.',
  validate: (value) => {
    if (value != null && value !== ""){
      let aux = value.replace(/(\s|-)/g, '');
      if (/^[a-zA-Z0-9]{1,6}$/.test(aux)) {
        return true;
      } else {
        return false;
      }
    }else{
      return true;
    }
    
  }
});

let instance = new Validator({
  trueField: 'validphone',
  trueField: 'validsin',
  trueField: 'valid_postal_code',
  trueField: 'validyears'
});
