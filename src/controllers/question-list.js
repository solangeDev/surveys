var hash = require('object-hash');
var md5 = require('md5');

module.exports = {
  encrypMd5(value) {
    return md5(value);
  },
  getParametersUrl: function () {
    var query_string = {};
    var query = window.location.href;
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      pair[1] = (pair[1] == "") ? undefined : pair[1];
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }

    }
    return query_string;
  },

  validFormRelationshipPoa(options) {
    let valid = true;
    let obj = {};
    obj.msj = ""
    const cantPhones = options.filter((a) => {
      if (a.type == "text-mask") {
        return a;
      }
    });
    const phones = cantPhones.filter((a) => {
      if (a.value == "" || a.value == null) {
        return a;
      }
    })
    if (phones.length == cantPhones.length) {
      obj.msj = "Must register a valid phone number"
      valid = false;
    }
    obj.value = valid;
    return obj;
  },

  validPhoneNumbers: function (options, cant) {
    let validQuestion = true;
    const checks = options.filter((a) => {
      if (a.type == "simple-checkbox") {
        if (a.value == true) {
          return a;
        }
      }
    })
    const values = options.filter((a) => {
      if (a.type == "text-mask") {
        if (a.value != null && a.value != "") {
          return a;
        }
      }
    })
    if (values.length == 0) {
      validQuestion = false;
    } else {
      if (checks.length > 0) {
        checks.forEach(element => {
          let value = element.valueBack;
          options.forEach((z) => {
            switch (value) {
              case "H":
                if (z.key_name == "home_number") {
                  if (z.value == null || z.value == "") {
                    validQuestion = false;
                  }
                }
                break;
              case "M":
                if (z.key_name == "mobile_number") {
                  if (z.value == null || z.value == "") {
                    validQuestion = false;
                  }
                }
                break;
              case "O":
                if (z.key_name == "office_number") {
                  if (z.value == null || z.value == "") {
                    validQuestion = false;
                  }
                }
                break;
            }
          })
        });
      }
    }
    return validQuestion;
  },
  validFormPorcentage: function (options) {
    let sum = 0;
    let valid = true;
    options.forEach((c) => {
      if (c.value !== null && c.value !== "")
        sum = sum + parseFloat(c.value);
    })
    if (sum > 100) {
      valid = false;
    }
    return valid;
  },
  validVeeValidate: function (options, validator) {
    const arrValErrors = options.filter(i => {
      if (i.type != "multiple-choice-checkbox" && i.type != "hidden" && i.type != "file") {
        validator.validate(i.attributes.key_validate).then(result => {
          if (!result) {
            return i;
          }
        });
      }
    });
    return arrValErrors;
  }
};
