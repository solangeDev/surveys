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
            }