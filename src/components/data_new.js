{
  "progress": null,
  "type": "account opening",
  "sections": [
    {
      "section_text": "Basic Information",
      "description": "Client's basic information",
      "attributes": [],
      "questions": [
        {
          "id": 1,
          "rules": [],
          "question_text": "What is your name?",
          "description": "Your full legal name is required to verify your identity.",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "first_name",
              "option_text": "First name",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "First name",
                "key_validate": "first name"
              },
              "value": "",
              "initial_value": "['person']['first_name']",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "middle_name",
              "option_text": "Middle name",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Middle name",
                "key_validate": "middle name"
              },
              "value": "",
              "initial_value": "['person']['middle_name']",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "last_name",
              "option_text": "Last name",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Last name",
                "key_validate": "last name"
              },
              "value": "",
              "initial_value": "['person']['last_name']",
              "validation": {
                "required": true
              }
            }
          ],
          "table": "persons",
          "columns": [
            {
              "first_name": "first_name",
              "middle_name": "middle_name",
              "last_name": "last_name"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 2,
          "rules": [],
          "question_text": "When and where were you born?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "date_of_birth",
              "option_text": "Date of birth",
              "type": "date",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Date of birth",
                "key_validate": "date of birth"
              },
              "value": "",
              "initial_value": "['person']['date_of_birth']",
              "validation": {
                "required": true,
                "validedad": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "country_of_birth",
              "option_text": "Country",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Country",
                "key_validate": "country"
              },
              "value": "",
              "initial_value": "['person']['country_of_birth']",
              "validation": {
                "required": true
              }
            }
          ],
          "table": "persons",
          "columns": [
            {
              "country_of_birth": "country_of_birth",
              "date_of_birth": "date_of_birth"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 3,
          "rules": [],
          "question_text": "Do you have a spouse or common-law partner? What is your current relationship status?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-single-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "marital_status",
              "option_text": "Single",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "single",
              "initial_value": "['person']['marital_status']",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{marital_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "marital_status",
              "option_text": "Married",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "tag": [
                {
                  "key": "{{marital_status}}",
                  "value": true
                }
              ],
              "value": "married",
              "initial_value": "['person']['marital_status']",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "marital_status",
              "option_text": "Common-Law",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "tag": [
                {
                  "key": "{{marital_status}}",
                  "value": true
                }
              ],
              "value": "common-law",
              "initial_value": "['person']['marital_status']",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "marital_status",
              "option_text": "Separated",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "separated",
              "initial_value": "['person']['marital_status']",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{marital_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "marital_status",
              "option_text": "Divorced",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "divorced",
              "initial_value": "['person']['marital_status']",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{marital_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "marital_status",
              "option_text": "Widowed",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "widowed",
              "initial_value": "['person']['marital_status']",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{marital_status}}",
                  "value": true
                }
              ]
            }
          ],
          "table": "persons",
          "columns": [
            {
              "marital_status": "marital_status"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 4,
          "rules": [
            {
              "value": [
                "married",
                "common-law"
              ],
              "value_type": "array",
              "operator": "==",
              "client_data": null,
              "param": "{{marital_status}}",
              "rule_type": "response",
              "description": "Shows question based on the client's marital status"
            }
          ],
          "preload_data": {
            "indice": "['relationships']",
            "value": "SP"
          },
          "question_text": "Tell us more about your partner",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "first_name",
              "option_text": "First name",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "First name",
                "key_validate": "first name"
              },
              "tag_text": {
                "key": "{{SPOUSE_FIRST_NAME}}",
                "value": true
              },
              "value": "['person']['first_name']",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "middle_name",
              "option_text": "Middle name",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Middle name",
                "key_validate": "middle name"
              },
              "value": "['person']['middle_name']",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "last_name",
              "option_text": "Last name",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Last name",
                "key_validate": "last name"
              },
              "value": "['person']['last_name']",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "date_of_birth",
              "option_text": "Date of birth",
              "type": "date",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Date of birth",
                "key_validate": "date of birth"
              },
              "value": "['person']['date_of_birth']",
              "validation": {
                "required": true,
                "validedad": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "SIN",
              "option_text": "SIN",
              "type": "text-mask",
              "mask": "###-###-###",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "046-454-286",
                "key_validate": "SIN"
              },
              "value": "",
              "initial_value": "['person']['SIN']",
              "sort_order": "1",
              "validation": {
                "required": true,
                "validsin": true
              }
            }
          ],
          "table": "persons",
          "columns": [
            {
              "first_name": "first_name",
              "middle_name": "middle_name",
              "last_name": "last_name",
              "date_of_birth": "date_of_birth",
              "SIN": "SIN"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": false,
          "relationship": "SP"
        },
        {
          "id": 5,
          "rules": [
            {
              "value": [
                "married",
                "common-law"
              ],
              "value_type": "array",
              "operator": "==",
              "client_data": null,
              "param": "{{marital_status}}",
              "rule_type": "response",
              "description": "Shows question based on the client's marital status"
            }
          ],
          "preload_data": {
            "indice": "['employment_details']",
            "value": "SP"
          },
          "question_text": "Please tell us about {{SPOUSE_FIRST_NAME}}'s employment situation",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-single-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "employment_status",
              "initial_value": "",
              "option_text": "Employed Full-Time",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "0",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{spouse_employment_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "employment_status",
              "initial_value": "",
              "option_text": "Self-Employed",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "2",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{spouse_employment_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "employment_status",
              "initial_value": "",
              "option_text": "Employed Part-Time",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "1",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{spouse_employment_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "employment_status",
              "initial_value": "",
              "option_text": "Retired",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "4",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{spouse_employment_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "employment_status",
              "initial_value": "",
              "option_text": "Unemployed",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "3",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{spouse_employment_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "employment_status",
              "initial_value": "",
              "option_text": "Student",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "5",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{spouse_employment_status}}",
                  "value": true
                }
              ]
            }
          ],
          "table": "client_employment",
          "columns": [
            {
              "employment_status": "employment_status"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": false,
          "relationship": "SP"
        },
        {
          "id": 6,
          "rules": [
            {
              "value": [
                "married",
                "common-law"
              ],
              "value_type": "array",
              "operator": "==",
              "client_data": null,
              "param": "{{marital_status}}",
              "rule_type": "response",
              "description": "Shows question based on the client's marital status"
            },
            {
              "value": [
                "0",
                "1",
                "2"
              ],
              "value_type": "array",
              "operator": "==",
              "client_data": null,
              "param": "{{spouse_employment_status}}",
              "rule_type": "response",
              "description": "Shows question based on the client's employment status"
            }
          ],
          "preload_data": {
            "indice": "['data_employment']",
            "value": "SP"
          },
          "question_text": "Please tell us about {{SPOUSE_FIRST_NAME}}'s job.",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "employer",
              "option_text": "Employer",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Employer",
                "key_validate": "employer"
              },
              "value": "['Client_Employment']['employer']",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "occupation",
              "option_text": "Occupation",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Occupation",
                "key_validate": "occupation"
              },
              "uses_endpoint": false,
              "value": [
                "['Client_Employment']['occupation']"
              ],
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "industry",
              "option_text": "Industry",
              "type": "dropdown",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Industry",
                "key_validate": "industry"
              },
              "value": "['Client_Employment']['industry']",
              "options": [
                {
                  "id": 1,
                  "value": "Accommodation and Food Services",
                  "text": "Accommodation and Food Services"
                },
                {
                  "id": 2,
                  "value": "Administrative and Support",
                  "text": "Administrative and Support"
                },
                {
                  "id": 3,
                  "value": "Waste Management and Remediation Service",
                  "text": "Waste Management and Remediation Service"
                },
                {
                  "id": 4,
                  "value": "Agriculture",
                  "text": "Agriculture"
                },
                {
                  "id": 5,
                  "value": "Forestry, Fishing and Hunting",
                  "text": "Forestry, Fishing and Hunting"
                },
                {
                  "id": 6,
                  "value": "Arts",
                  "text": "Arts"
                },
                {
                  "id": 7,
                  "value": "Entertainment and Recreation",
                  "text": "Entertainment and Recreation"
                },
                {
                  "id": 8,
                  "value": "Construction",
                  "text": "Construction"
                },
                {
                  "id": 9,
                  "value": "Educational Services",
                  "text": "Educational Services"
                },
                {
                  "id": 10,
                  "value": "Finance and Insurance",
                  "text": "Finance and Insurance"
                },
                {
                  "id": 11,
                  "value": "Health Care and Social Assistance",
                  "text": "Health Care and Social Assistance"
                },
                {
                  "id": 12,
                  "value": "Information and Cultural Industries",
                  "text": "Information and Cultural Industries"
                },
                {
                  "id": 13,
                  "value": "Management of Companies and Enterprises",
                  "text": "Management of Companies and Enterprises"
                },
                {
                  "id": 14,
                  "value": "Manufacturing",
                  "text": "Manufacturing"
                },
                {
                  "id": 15,
                  "value": "Mining, Quarrying, and Oil / Gas Extraction",
                  "text": "Mining, Quarrying, and Oil / Gas Extraction"
                },
                {
                  "id": 16,
                  "value": "Other Services (except Public Administration)",
                  "text": "Other Services (except Public Administration)"
                },
                {
                  "id": 17,
                  "value": "Professional, Scientific and Technical Services",
                  "text": "Professional, Scientific and Technical Services"
                },
                {
                  "id": 18,
                  "value": "Public Administration",
                  "text": "Public Administration"
                },
                {
                  "id": 19,
                  "value": "Real Estate and Rental and Leasing",
                  "text": "Real Estate and Rental and Leasing"
                },
                {
                  "id": 20,
                  "value": "Retail Trade",
                  "text": "Retail Trade"
                },
                {
                  "id": 21,
                  "value": "Transportation and Warehousing",
                  "text": "Transportation and Warehousing"
                },
                {
                  "id": 22,
                  "value": "Utilities",
                  "text": "Utilities"
                },
                {
                  "id": 23,
                  "value": "Wholesale Trade",
                  "text": "Wholesale Trade"
                }
              ],
              "validation": {
                "required": true
              }
            }
          ],
          "table": "client_employment",
          "columns": [
            {
              "employer": "employer",
              "occupation": "occupation",
              "industry": "industry"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": false,
          "relationship": "SP"
        },
        {
          "id": 7,
          "rules": [
            {
              "value": [
                "married",
                "common-law"
              ],
              "value_type": "array",
              "operator": "==",
              "client_data": null,
              "param": "{{marital_status}}",
              "rule_type": "response",
              "description": "Shows question based on the client's marital status"
            },
            {
              "value": [
                "0",
                "1",
                "2"
              ],
              "value_type": "array",
              "operator": "==",
              "client_data": null,
              "param": "{{spouse_employment_status}}",
              "rule_type": "response",
              "description": "Shows question based on the client's employment status"
            }
          ],
          "question_text": "What is the address of your {{SPOUSE_FIRST_NAME}}'s employer?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "address_line_1",
              "option_text": "Address line 1",
              "type": "address",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "key_validate": "address line 1",
                "placeholder": "Address line 1"
              },
              "value": "",
              "inputFilled": [
                {
                  "option_text": "City",
                  "key_name": "city"
                },
                {
                  "option_text": "Country",
                  "key_name": "country"
                },
                {
                  "option_text": "Province",
                  "key_name": "province"
                },
                {
                  "option_text": "Postal code",
                  "key_name": "postal_code"
                },
                {
                  "option_text": "Cod Province",
                  "key_name": "cod_province"
                },
                {
                  "option_text": "Address Line 2",
                  "key_name": "address_line_2"
                }
              ],
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "address_line_2",
              "option_text": "Address line 2",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Address line 2",
                "key_validate": "address line"
              },
              "value": "",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "city",
              "option_text": "City",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "City",
                "key_validate": "city"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "province",
              "option_text": "Province",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Province",
                "key_validate": "province"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "postal_code",
              "option_text": "Postal code",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Postal code",
                "key_validate": "postal code",
                "maxlength": 7
              },
              "value": "",
              "validation": {
                "valid_postal_code": "valid_postal_code",
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "country",
              "option_text": "Country",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Country",
                "key_validate": "country"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "client_address_type",
              "option_text": "Address Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "E",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "cod_province",
              "option_text": "Cod Province",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "",
              "validation": {
                "required": false
              }
            }
          ],
          "table": "client_addresses",
          "columns": [
            {
              "address_line_1": "address_line_1",
              "address_line_2": "address_line_2",
              "city": "city",
              "province": "province",
              "cod_province": "cod_province",
              "postal_code": "postal_code",
              "country": "country",
              "client_address_type": "client_address_type"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": false,
          "relationship": "SP"
        },
        {
          "id": 8,
          "rules": [],
          "question_text": "How many dependents do you have?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "dependents",
              "option_text": "Number of dependents",
              "type": "text-mask",
              "mask": "###",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Number of dependents",
                "min": 0,
                "key_validate": "number of dependents"
              },
              "value": "",
              "initial_value": "['person']['dependents']",
              "validation": {
                "required": true
              }
            }
          ],
          "table": "persons",
          "columns": [
            {
              "dependents": "dependents"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "preload_data": {
            "indice": "['ClientAddresses']",
            "value": "P"
          },
          "id": 9,
          "rules": [],
          "question_text": "What is your primary residential address?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "address_line_1",
              "option_text": "Address line 1",
              "type": "address",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "key_validate": "address line",
                "placeholder": "Address line 1"
              },
              "value": "",
              "inputFilled": [
                {
                  "option_text": "City",
                  "key_name": "city"
                },
                {
                  "option_text": "Country",
                  "key_name": "country"
                },
                {
                  "option_text": "Province",
                  "key_name": "province"
                },
                {
                  "option_text": "Postal code",
                  "key_name": "postal_code"
                },
                {
                  "option_text": "Cod Province",
                  "key_name": "cod_province"
                },
                {
                  "option_text": "Address Line 2",
                  "key_name": "address_line_2"
                }
              ],
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "address_line_2",
              "option_text": "Address line 2",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Address line 2",
                "key_validate": "address line"
              },
              "value": "",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "city",
              "option_text": "City",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "City",
                "key_validate": "city"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "province",
              "option_text": "Province",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Province",
                "key_validate": "province"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "postal_code",
              "option_text": "Postal code",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Postal code",
                "key_validate": "postal code",
                "maxlength": 7
              },
              "value": "",
              "validation": {
                "valid_postal_code": "valid_postal_code",
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "country",
              "option_text": "Country",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Country",
                "key_validate": "country"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "valid_next_question": true,
              "key_name": "is_mailing",
              "option_text": "My mailing address is the same",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "is_mailing",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{is_mailing}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "married",
                    "common-law"
                  ]
                }
              ],
              "key_name": "partner_same_address",
              "option_text": "My partner has the same address",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "is_spouse",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "client_address_type",
              "option_text": "Address Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "P",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_residential",
              "option_text": "Address Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "true",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "cod_province",
              "option_text": "Cod Province",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "",
              "validation": {
                "required": false
              }
            }
          ],
          "table": "client_addresses",
          "columns": [
            {
              "address_line_1": "address_line_1",
              "address_line_2": "address_line_2",
              "city": "city",
              "province": "province",
              "cod_province": "cod_province",
              "postal_code": "postal_code",
              "country": "country",
              "client_address_type": "client_address_type",
              "is_residential": "is_residential",
              "is_mailing": "is_mailing"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 10,
          "rules": [
            {
              "value": "false",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{is_mailing}}",
              "rule_type": "response",
              "description": "Shows question if client doesn't select primary address as mailing address"
            }
          ],
          "preload_data": {
            "indice": "['ClientAddresses']",
            "value": "mailing"
          },
          "question_text": "What is your mailing address?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "cod_province",
              "option_text": "Cod Province",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "address_line_1",
              "option_text": "Address line 1",
              "type": "address",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "key_validate": "address line",
                "placeholder": "Address line 1"
              },
              "value": "",
              "inputFilled": [
                {
                  "option_text": "City",
                  "key_name": "city"
                },
                {
                  "option_text": "Country",
                  "key_name": "country"
                },
                {
                  "option_text": "Province",
                  "key_name": "province"
                },
                {
                  "option_text": "Postal code",
                  "key_name": "postal_code"
                },
                {
                  "option_text": "Cod Province",
                  "key_name": "cod_province"
                },
                {
                  "option_text": "Address Line 2",
                  "key_name": "address_line_2"
                }
              ],
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "address_line_2",
              "option_text": "Address line 2",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Address line 2",
                "key_validate": "address line"
              },
              "value": "",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "city",
              "option_text": "City",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "City",
                "key_validate": "city"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "province",
              "option_text": "Province",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Province",
                "key_validate": "province"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "postal_code",
              "option_text": "Postal code",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Postal code",
                "maxlength": 7,
                "key_validate": "postal code"
              },
              "value": "",
              "validation": {
                "valid_postal_code": "valid_postal_code",
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "country",
              "option_text": "Country",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Country",
                "key_validate": "country"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_mailing",
              "option_text": "Is Mailing",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "is_mailing",
              "validation": {
                "required": true
              }
            }
          ],
          "table": "client_addresses",
          "columns": [
            {
              "address_line_1": "address_line_1",
              "address_line_2": "address_line_2",
              "city": "city",
              "province": "province",
              "postal_code": "postal_code",
              "country": "country",
              "client_address_type": "client_address_type",
              "is_mailing": "is_mailing"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 11,
          "rules": [],
          "question_text": "What are your telephone numbers?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "phone-number-form",
          "is_required": true,
          "client_section_data": null,
          "validation": {
            "phone-number-form": true
          },
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "mobile_number",
              "option_text": "Mobile",
              "type": "text-mask",
              "mask": "###-###-####",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Mobile",
                "key_validate": "mobile"
              },
              "value": "",
              "initial_value": "['mobile_number']",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "preferred_number",
              "option_text": "Primary Number Mobile",
              "type": "simple-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Mobile"
              },
              "value": "M",
              "validation": {
                "required": false
              },
              "initial_value": "['preferred_number']",
              "readonly": {
                "key_name": [
                  "H",
                  "O"
                ]
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "home_number",
              "option_text": "Home",
              "type": "text-mask",
              "mask": "###-###-####",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Home",
                "key_validate": "home"
              },
              "value": "",
              "initial_value": "['home_number']",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "preferred_number",
              "option_text": "Primary Number Home",
              "type": "simple-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "H",
              "initial_value": "['preferred_number']",
              "validation": {
                "required": false
              },
              "readonly": {
                "key_name": [
                  "M",
                  "O"
                ]
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "office_number",
              "option_text": "Work",
              "type": "text-mask",
              "mask": "###-###-####",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Work",
                "key_validate": "work"
              },
              "value": "",
              "initial_value": "['office_number']",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "preferred_number",
              "option_text": "Primary Number Work",
              "type": "simple-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "O",
              "initial_value": "['preferred_number']",
              "validation": {
                "required": false
              },
              "readonly": {
                "key_name": [
                  "M",
                  "H"
                ]
              }
            }
          ],
          "table": "clients",
          "columns": [
            {
              "mobile_number": "mobile_number",
              "home_number": "home_number",
              "office_number": "office_number",
              "preferred_number": "preferred_number"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 12,
          "rules": [],
          "question_text": "Please tell us about your employment situation",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-single-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "initial_value": "['ClientEmployment']['0']['employment_status']",
              "key_name": "employment_status",
              "option_text": "Employed Full-Time",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "0",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{employment_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "initial_value": "['ClientEmployment']['0']['employment_status']",
              "key_name": "employment_status",
              "option_text": "Self-Employed",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "2",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{employment_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "initial_value": "['ClientEmployment']['0']['employment_status']",
              "key_name": "employment_status",
              "option_text": "Employed Part-Time",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "1",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{employment_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "initial_value": "['ClientEmployment']['0']['employment_status']",
              "key_name": "employment_status",
              "option_text": "Retired",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "4",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{employment_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "initial_value": "['ClientEmployment']['0']['employment_status']",
              "key_name": "employment_status",
              "option_text": "Unemployed",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "3",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{employment_status}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "initial_value": "['ClientEmployment']['0']['employment_status']",
              "key_name": "employment_status",
              "option_text": "Student",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "5",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{employment_status}}",
                  "value": true
                }
              ]
            }
          ],
          "table": "client_employment",
          "columns": [
            {
              "employment_status": "employment_status"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "rules": [
            {
              "value": [
                "0",
                "1",
                "2"
              ],
              "value_type": "array",
              "operator": "==",
              "client_data": null,
              "param": "{{employment_status}}",
              "rule_type": "response",
              "description": "Shows question based on the client's employment status"
            }
          ],
          "id": 13,
          "question_text": "Please tell us about your job.",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "initial_value": "['ClientEmployment']['0']['employer']",
              "key_name": "employer",
              "option_text": "Employer",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Employer",
                "key_validate": "employer"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "initial_value": "['ClientEmployment']['0']['occupation']",
              "key_name": "occupation",
              "option_text": "Occupation",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Occupation",
                "key_validate": "occupation"
              },
              "uses_endpoint": false,
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "initial_value": "['ClientEmployment']['0']['industry']",
              "key_name": "industry",
              "option_text": "Industry",
              "type": "dropdown",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Industry",
                "key_validate": "industry"
              },
              "value": "",
              "options": [
                {
                  "id": 1,
                  "value": "Accommodation and Food Services",
                  "text": "Accommodation and Food Services"
                },
                {
                  "id": 2,
                  "value": "Administrative and Support",
                  "text": "Administrative and Support"
                },
                {
                  "id": 3,
                  "value": "Waste Management and Remediation Service",
                  "text": "Waste Management and Remediation Service"
                },
                {
                  "id": 4,
                  "value": "Agriculture",
                  "text": "Agriculture"
                },
                {
                  "id": 5,
                  "value": "Forestry, Fishing and Hunting",
                  "text": "Forestry, Fishing and Hunting"
                },
                {
                  "id": 6,
                  "value": "Arts",
                  "text": "Arts"
                },
                {
                  "id": 7,
                  "value": "Entertainment and Recreation",
                  "text": "Entertainment and Recreation"
                },
                {
                  "id": 8,
                  "value": "Construction",
                  "text": "Construction"
                },
                {
                  "id": 9,
                  "value": "Educational Services",
                  "text": "Educational Services"
                },
                {
                  "id": 10,
                  "value": "Finance and Insurance",
                  "text": "Finance and Insurance"
                },
                {
                  "id": 11,
                  "value": "Health Care and Social Assistance",
                  "text": "Health Care and Social Assistance"
                },
                {
                  "id": 12,
                  "value": "Information and Cultural Industries",
                  "text": "Information and Cultural Industries"
                },
                {
                  "id": 13,
                  "value": "Management of Companies and Enterprises",
                  "text": "Management of Companies and Enterprises"
                },
                {
                  "id": 14,
                  "value": "Manufacturing",
                  "text": "Manufacturing"
                },
                {
                  "id": 15,
                  "value": "Mining, Quarrying, and Oil / Gas Extraction",
                  "text": "Mining, Quarrying, and Oil / Gas Extraction"
                },
                {
                  "id": 16,
                  "value": "Other Services (except Public Administration)",
                  "text": "Other Services (except Public Administration)"
                },
                {
                  "id": 17,
                  "value": "Professional, Scientific and Technical Services",
                  "text": "Professional, Scientific and Technical Services"
                },
                {
                  "id": 18,
                  "value": "Public Administration",
                  "text": "Public Administration"
                },
                {
                  "id": 19,
                  "value": "Real Estate and Rental and Leasing",
                  "text": "Real Estate and Rental and Leasing"
                },
                {
                  "id": 20,
                  "value": "Retail Trade",
                  "text": "Retail Trade"
                },
                {
                  "id": 21,
                  "value": "Transportation and Warehousing",
                  "text": "Transportation and Warehousing"
                },
                {
                  "id": 22,
                  "value": "Utilities",
                  "text": "Utilities"
                },
                {
                  "id": 23,
                  "value": "Wholesale Trade",
                  "text": "Wholesale Trade"
                }
              ],
              "validation": {
                "required": true
              }
            }
          ],
          "table": "client_employment",
          "columns": [
            {
              "employer": "employer",
              "occupation": "occupation",
              "industry": "industry"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "rules": [
            {
              "value": [
                "0",
                "1",
                "2"
              ],
              "value_type": "array",
              "operator": "==",
              "client_data": null,
              "param": "{{employment_status}}",
              "rule_type": "response",
              "description": "Shows question based on the client's employment status"
            }
          ],
          "preload_data": {
            "indice": "['ClientAddresses']",
            "value": "E"
          },
          "id": 14,
          "question_text": "What is the address of your employer?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "address_line_1",
              "option_text": "Address line 1",
              "type": "address",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "key_validate": "address line",
                "placeholder": "Address line 1"
              },
              "value": "",
              "inputFilled": [
                {
                  "option_text": "City",
                  "key_name": "city"
                },
                {
                  "option_text": "Country",
                  "key_name": "country"
                },
                {
                  "option_text": "Province",
                  "key_name": "province"
                },
                {
                  "option_text": "Postal code",
                  "key_name": "postal_code"
                },
                {
                  "option_text": "Cod Province",
                  "key_name": "cod_province"
                }
              ],
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "address_line_2",
              "option_text": "Address line 2",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Address line 2",
                "key_validate": "address line"
              },
              "value": "",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "city",
              "option_text": "City",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "City",
                "key_validate": "city"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "province",
              "option_text": "Province",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Province",
                "key_validate": "province"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "postal_code",
              "option_text": "Postal code",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Postal code",
                "maxlength": 7,
                "key_validate": "postal code"
              },
              "value": "",
              "validation": {
                "valid_postal_code": "valid_postal_code",
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "country",
              "option_text": "Country",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Country",
                "key_validate": "country"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "client_address_type",
              "option_text": "Address Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "E",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_mailing",
              "option_text": "Is Mailing",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_residential",
              "option_text": "Is Residential",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "cod_province",
              "option_text": "Cod Province",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "",
              "validation": {
                "required": false
              }
            }
          ],
          "table": "client_addresses",
          "columns": [
            {
              "address_line_1": "address_line_1",
              "address_line_2": "address_line_2",
              "city": "city",
              "province": "province",
              "cod_province": "cod_province",
              "postal_code": "postal_code",
              "country": "country",
              "client_address_type": "client_address_type",
              "is_residential": "is_residential",
              "is_mailing": "is_mailing"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 15,
          "rules": [],
          "question_text": "What is your Social Insurance Number?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "SIN",
              "option_text": "SIN",
              "type": "text-mask",
              "mask": "###-###-###",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "046-454-286",
                "key_validate": "SIN"
              },
              "value": "",
              "initial_value": "['person']['SIN']",
              "sort_order": "1",
              "validation": {
                "required": true,
                "validsin": true
              }
            }
          ],
          "sort_order": "1",
          "table": "persons",
          "columns": [
            {
              "SIN": "SIN"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        }
      ]
    },
    {
      "section_text": "Security",
      "description": "Disclose Information",
      "attributes": [],
      "questions": [
        {
          "id": 16,
          "rules": [],
          "question_text": "Do you object to us disclosing your information to the issuers of securities held in your portfolio?",
          "description": "This is a question required by regulators asking you if we can disclose information like your name, address, e-mail address, securities holdings and preferred language of communications to the issuers of securities in your portfolio.",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-single-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "beneficial_ownership_disc",
              "option_text": "I do not object to my information being disclosed",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "1",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "beneficial_ownership_disc",
              "option_text": "I object to my information being disclosed",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "2",
              "validation": {
                "required": false
              }
            }
          ],
          "table": "clients",
          "columns": [
            {
              "beneficial_ownership_disc": "beneficial_ownership_disc"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 17,
          "rules": [],
          "question_text": "What security holder materials do you want to receive about your holdings with us? (Most elect to decline all)",
          "description": "Security holder materials consist of proxy-related materials for annual and special meetings, annual reports and financial statements that are not part of proxy-related materials, and materials sent to securityholders that are not required by corporate or securities law.",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-single-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "shareholder_comm_pref",
              "option_text": "I want to receive all security holder materials",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "3",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "shareholder_comm_pref",
              "option_text": "I decline to receive security holder materials",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "1",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "shareholder_comm_pref",
              "option_text": "I want to receive only proxy-related materials",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "2",
              "validation": {
                "required": false
              }
            }
          ],
          "table": "clients",
          "columns": [
            {
              "shareholder_comm_pref": "shareholder_comm_pref"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        }
      ]
    },
    {
      "section_text": "Language",
      "description": "",
      "attributes": [],
      "questions": [
        {
          "id": 18,
          "rules": [],
          "question_text": "What language do you prefer when you receive communications from us?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-single-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "preferred_lang",
              "option_text": "English",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "en",
              "initial_value": "['preferred_lang']",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "preferred_lang",
              "option_text": "French",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "fr",
              "initial_value": "['preferred_lang']",
              "validation": {
                "required": false
              }
            }
          ],
          "table": "clients",
          "columns": [
            {
              "preferred_lang": "preferred_lang"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        }
      ]
    },
    {
      "section_text": "Country",
      "description": "",
      "attributes": [],
      "questions": [
        {
          "id": 19,
          "rules": [],
          "question_text": "Are you a citizen of: ",
          "description": "Select all that apply",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-multiple-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_canadian",
              "option_text": "Canada",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "true",
              "initial_value": "['is_canadian']",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_us_citizen",
              "option_text": "United States",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "true",
              "initial_value": "['is_us_citizen']",
              "validation": {
                "required": false
              }
            }
          ],
          "table": "persons",
          "columns": [
            {
              "is_canadian": "is_canadian",
              "is_us_citizen": "is_us_citizen"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        }
      ]
    },
    {
      "section_text": "U.S. Tax Payer",
      "description": "",
      "attributes": [],
      "questions": [
        {
          "id": 20,
          "rules": [],
          "question_text": "Are you considered a U.S. Person for tax purposes?",
          "description": "Are you a U.S. citizen, green card holder, U.S. resident, or were you born in the U.S.?",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-single-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_us_person",
              "option_text": "Yes",
              "type": "single-choice-checkbox",
              "value_type": "boolean",
              "compare": true,
              "attributes": [],
              "value": "true",
              "initial_value": "['is_us_person']",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{is_us_person}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_us_person",
              "option_text": "No",
              "type": "single-choice-checkbox",
              "value_type": "boolean",
              "compare": true,
              "attributes": [],
              "value": "false",
              "validation": {
                "required": false
              },
              "tag": [
                {
                  "key": "{{is_us_person}}",
                  "value": true
                }
              ]
            }
          ],
          "table": "persons",
          "columns": [
            {
              "is_us_person": "is_us_person"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 21,
          "rules": [
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{is_us_person}}",
              "rule_type": "response",
              "description": "Shows question if clients is U.S. Person"
            }
          ],
          "question_text": "What is your Social Security Number?",
          "description": "A Social Security Number is your taxpayer identification number for the United States",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "SSN",
              "option_text": "Social Security Number",
              "type": "text-mask",
              "mask": "###-###-###",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "046-454-286",
                "key_validate": "SSN"
              },
              "value": "",
              "initial_value": "['person']['SSN']",
              "validation": {
                "required": true
              }
            }
          ],
          "table": "persons",
          "columns": [
            {
              "SSN": "SSN"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        }
      ]
    },
    {
      "section_text": "Account information",
      "description": "",
      "attributes": [],
      "questions": [
        {
          "id": 22,
          "rules": [],
          "question_text": "Where did the money in your investment accounts come from?",
          "description": "Knowing about the source of the funds used to create your investment portfolio is a regulatory requirement (select all that apply).",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-multiple-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "salary",
              "option_text": "Salary Income",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "salary",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "investments",
              "option_text": "Investment Income",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "investments",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "gift_inheritance",
              "option_text": "Gift/Inheritance",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "gift_inheritance",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "business",
              "option_text": "Business Self-Employed Income",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "business",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "asset_sale",
              "option_text": "Sale of Asset",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "asset_sale",
              "validation": {
                "required": false
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "legal_settlement",
              "option_text": "Settlement of Legal /  Insurance Claim",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "legal_settlement",
              "validation": {
                "required": false
              }
            }
          ],
          "table": "client_funds_source",
          "columns": [
            {
              "salary": "salary",
              "investments": "investments",
              "gift_inheritance": "gift_inheritance",
              "business": "business",
              "asset_sale": "asset_sale",
              "legal_settlement": "legal_settlement"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        }
      ]
    },
    {
      "section_text": "Power of Attorney",
      "description": "",
      "attributes": "",
      "questions": [
        {
          "id": 23,
          "rules": [],
          "question_text": "Will anyone have legal power of attorney over your accounts?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-single-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "power_of_attorney",
              "option_text": "Yes",
              "type": "single-choice-checkbox",
              "value_type": "boolean",
              "compare": true,
              "attributes": [],
              "value": "true",
              "validation": [],
              "tag": [
                {
                  "key": "{{power_of_attorney}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "power_of_attorney",
              "option_text": "No",
              "type": "single-choice-checkbox",
              "value_type": "boolean",
              "compare": true,
              "attributes": [],
              "value": "false",
              "validation": [],
              "tag": [
                {
                  "key": "{{power_of_attorney}}",
                  "value": true
                }
              ]
            }
          ],
          "table": "relationships",
          "columns": [
            {
              "power_of_attorney": "power_of_attorney"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": false,
          "relationship": ""
        },
        {
          "id": 24,
          "rules": [
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{power_of_attorney}}",
              "rule_type": "response",
              "description": "Shows question if client has Power of Attorney"
            }
          ],
          "set_data_response": "modal_add_relationship",
          "question_text": "Who will hold the Power of Attorney?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "multiple-choice-checkbox",
          "type": "multiple-dynamic-options",
          "is_required": true,
          "client_section_data": "['relationships']",
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "add_relationship",
              "option_text": "Add Relationship",
              "title_modal": "Add Relationship",
              "type": "modal_form",
              "value_type": "string",
              "update_relationship": true,
              "update_questions": [
                {
                  "id_question": 399,
                  "option": "multiple-choice-checkbox"
                },
                {
                  "id_question": 39,
                  "option": "single-choice-checkbox",
                  "section_pep": true
                },
                {
                  "id_question": 499,
                  "option": "multiple-choice-checkbox"
                }
              ],
              "compare": true,
              "form_options": [
                {
                  "key_name": "first_name",
                  "option_text": "First name",
                  "type": "text",
                  "attributes": {
                    "placeholder": "First name",
                    "key_validate": "first name"
                  },
                  "value": "",
                  "validation": {
                    "required": true
                  }
                },
                {
                  "key_name": "last_name",
                  "option_text": "Last name",
                  "type": "text",
                  "attributes": {
                    "placeholder": "Last name",
                    "key_validate": "last name"
                  },
                  "value": "",
                  "validation": {
                    "required": true
                  }
                },
                {
                  "filter_marital": true,
                  "key_name": "relationship",
                  "option_text": "Relationship",
                  "type": "dropdown",
                  "attributes": {
                    "placeholder": "Relationship",
                    "key_validate": "relationship"
                  },
                  "value": "",
                  "options": [
                    {
                      "id": 4,
                      "text": "Parent",
                      "value": "PA"
                    },
                    {
                      "id": 11,
                      "text": "Parents Sibling",
                      "value": "PS"
                    },
                    {
                      "id": 5,
                      "text": "Child",
                      "value": "CH"
                    },
                    {
                      "id": 17,
                      "text": "Spouse",
                      "value": "SP"
                    },
                    {
                      "id": 1,
                      "text": "Common-law",
                      "value": "CL"
                    },
                    {
                      "id": 15,
                      "text": "Sibling",
                      "value": "SB"
                    },
                    {
                      "id": 10,
                      "text": "Siblings Child",
                      "value": "SC"
                    },
                    {
                      "id": 12,
                      "text": "Cousin",
                      "value": "CO"
                    },
                    {
                      "id": 16,
                      "text": "Friend",
                      "value": "FR"
                    }
                  ],
                  "validation": {
                    "required": true
                  }
                }
              ],
              "value": "add_relationship",
              "validation": {}
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "power_of_attorney",
              "option_text": "Power of Attorney",
              "type": "hidden",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Power of Attorney"
              },
              "value": "true",
              "validation": {
                "required": true
              }
            }
          ],
          "table": "relationships",
          "columns": [
            {
              "client_id": "client_id",
              "power_of_attorney": "power_of_attorney"
            }
          ],
          "responses": [],
          "is_dynamic": true,
          "is_primary_client": false,
          "relationship": ""
        }
      ]
    },
    {
      "section_text": "Test",
      "description": "Test",
      "attributes": [],
      "questions": [
        {
          "id": 8000,
          "rules": [],
          "question_text": "",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form-group",
          "reset_response": true,
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [],
              "key_name": "question_26",
              "option_text": "Are you or is anyone in your household employed by IIROC (Investment Industry Regulatory Organization of Canada) regulated firm?",
              "type": "button_bool",
              "attributes": {},
              "value": "",
              "validation": {},
              "tag": [
                {
                  "key": "{{question_26}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [],
              "key_name": "question_28",
              "option_text": "Are you or is anyone in your household an insider or director of a publicly listed company?",
              "type": "button_bool",
              "attributes": {},
              "value": "",
              "validation": {},
              "tag": [
                {
                  "key": "{{question_28}}",
                  "value": true
                }
              ],
              "reset_responses": [
                {
                  "value": "false",
                  "questions": [
                    29,
                    30,
                    31
                  ]
                }
              ]
            },
            {
              "dependencies": [],
              "key_name": "question_32",
              "option_text": "Are you or is your spouse a significant shareholder (>10%) of a publicly listed company?",
              "type": "button_bool",
              "attributes": {},
              "value": "",
              "validation": {},
              "tag": [
                {
                  "key": "{{question_32}}",
                  "value": true
                }
              ],
              "tag_button_bool": [
                {
                  "option": "true",
                  "tags": [
                    {
                      "key": "{{bool_is_significant_shareholder}}",
                      "value": true
                    },
                    {
                      "key": "{{is_significant_shareholder}}",
                      "value": true,
                      "value_key": false
                    },
                    {
                      "key": "{{spouse_is_significant_shareholder}}",
                      "value": true,
                      "value_key": false
                    }
                  ]
                },
                {
                  "option": "false",
                  "tags": [
                    {
                      "key": "{{bool_is_significant_shareholder}}",
                      "value": true
                    }
                  ]
                }
              ],
              "reset_responses": [
                {
                  "value": "false",
                  "questions": [
                    33,
                    34,
                    35
                  ]
                }
              ]
            }
          ],
          "table": "persons",
          "columns": [
            {
              "first_name": "first_name",
              "middle_name": "middle_name",
              "last_name": "last_name"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 27,
          "rules": [
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{question_26}}",
              "rule_type": "response",
              "description": "Shows question if the client is regulated"
            }
          ],
          "question_text": "Who is employed by IIROC (Investment Industry Regulatory Organization of Canada) regulated firm?",
          "description": "Select all that apply",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-multiple-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_regulated",
              "option_text": "I am registered with IIROC",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "i_am",
              "validation": []
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "married",
                    "common-law"
                  ]
                }
              ],
              "key_name": "spouse_is_regulated",
              "option_text": "My spouse is registered with IIROC",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "my_spouse",
              "validation": []
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "someone_else_is_regulated",
              "option_text": "Someone else is registered with IIROC",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "someone_else",
              "validation": [],
              "tag": [
                {
                  "key": "{{list_relationship_iiroc}}",
                  "value": true,
                  "verify": true
                },
                {
                  "key": "{{filter_spouse}}",
                  "value": true,
                  "value_key": "true",
                  "verify": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "kyc_type_r",
              "option_text": "KYC Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "R",
              "validation": []
            }
          ],
          "table": "persons",
          "columns": [
            {
              "kyc_type_r": "kyc_type_r",
              "is_regulated": "is_regulated",
              "spouse_is_regulated": "spouse_is_regulated"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 399,
          "rules": [
            {
              "value": "someone_else",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{list_relationship_iiroc}}",
              "rule_type": "response",
              "description": "Shows question based on the client's marital status"
            }
          ],
          "add_relationship": {
            "tag": "{{add_relationship_iiroc}}"
          },
          "set_data_response": "modal_add_relationship",
          "question_text": "Who is employed by IIROC?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "multiple-choice-checkbox",
          "type": "multiple-dynamic-options",
          "is_required": true,
          "client_section_data": "['relationships']",
          "filter_section_data": [
            {
              "tag": "{{filter_spouse}}",
              "value": "SP"
            }
          ],
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "add_relationship",
              "option_text": "Add Relationship",
              "title_modal": "Add Relationship",
              "type": "modal_form",
              "value_type": "string",
              "update_relationship": true,
              "compare": true,
              "update_questions": [
                {
                  "id_question": 39,
                  "option": "single-choice-checkbox",
                  "section_pep": true
                },
                {
                  "id_question": 499,
                  "option": "multiple-choice-checkbox"
                }
              ],
              "form_options": [
                {
                  "key_name": "first_name",
                  "option_text": "First name",
                  "type": "text",
                  "attributes": {
                    "placeholder": "First name",
                    "key_validate": "first name"
                  },
                  "value": "",
                  "validation": {
                    "required": true
                  }
                },
                {
                  "key_name": "last_name",
                  "option_text": "Last name",
                  "type": "text",
                  "attributes": {
                    "placeholder": "Last name",
                    "key_validate": "last name"
                  },
                  "value": "",
                  "validation": {
                    "required": true
                  }
                },
                {
                  "filter_marital": true,
                  "key_name": "relationship",
                  "option_text": "Relationship",
                  "type": "dropdown",
                  "attributes": {
                    "placeholder": "Relationship",
                    "key_validate": "relationship"
                  },
                  "value": "",
                  "options": [
                    {
                      "id": 4,
                      "text": "Parent",
                      "value": "PA"
                    },
                    {
                      "id": 11,
                      "text": "Parents Sibling",
                      "value": "PS"
                    },
                    {
                      "id": 5,
                      "text": "Child",
                      "value": "CH"
                    },
                    {
                      "id": 17,
                      "text": "Spouse",
                      "value": "SP"
                    },
                    {
                      "id": 1,
                      "text": "Common-law",
                      "value": "CL"
                    },
                    {
                      "id": 15,
                      "text": "Sibling",
                      "value": "SB"
                    },
                    {
                      "id": 10,
                      "text": "Siblings Child",
                      "value": "SC"
                    },
                    {
                      "id": 12,
                      "text": "Cousin",
                      "value": "CO"
                    },
                    {
                      "id": 16,
                      "text": "Friend",
                      "value": "FR"
                    }
                  ],
                  "validation": {
                    "required": true
                  }
                }
              ],
              "value": "add_relationship",
              "validation": {}
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "kyc_type",
              "option_text": "KYC Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "R",
              "validation": []
            }
          ],
          "table": "kyc_details",
          "columns": [
            {
              "kyc_type": "kyc_type"
            }
          ],
          "responses": [],
          "is_dynamic": true,
          "is_primary_client": false,
          "relationship": ""
        },
        {
          "id": 29,
          "rules": [
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{question_28}}",
              "rule_type": "response",
              "description": "Shows question if the client is insider"
            }
          ],
          "question_text": "Who is an insider or director of a publicly listed company?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-multiple-choice",
          "is_required": true,
          "verify_tag": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_insider",
              "option_text": "I am an insider or director",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "i_am",
              "validation": [],
              "tag": [
                {
                  "key": "{{is_insider}}",
                  "value": true,
                  "verify": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "married",
                    "common-law"
                  ]
                }
              ],
              "key_name": "spouse_is_insider",
              "option_text": "My spouse is an insider or director",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "my_spouse",
              "validation": [],
              "tag": [
                {
                  "key": "{{spouse_is_insider}}",
                  "value": true,
                  "verify": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "someone_else_is_regulated",
              "option_text": "Someone else is an insider and/or director",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "someone_else",
              "validation": [],
              "tag": [
                {
                  "key": "{{list_relationship_insider}}",
                  "value": true,
                  "verify": true
                },
                {
                  "key": "{{filter_spouse}}",
                  "value": true,
                  "value_key": "true",
                  "verify": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "kyc_type_i",
              "option_text": "KYC Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "I",
              "validation": []
            }
          ],
          "table": "persons",
          "columns": [
            {
              "is_insider": "is_insider",
              "spouse_is_insider": "spouse_is_insider",
              "kyc_type_i": "kyc_type_i"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 30,
          "rules": [
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{question_28}}",
              "rule_type": "response",
              "description": "Shows question if the client is insider"
            },
            {
              "value": "i_am",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{is_insider}}",
              "rule_type": "response",
              "description": "Shows question if the client is director"
            }
          ],
          "question_text": "Please tell us about the company of which you are an insider or director.",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "company",
              "option_text": "Company details",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Company details",
                "key_validate": "company details"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "ticker_symbol",
              "option_text": "Company ticker symbol",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Company ticker symbol",
                "key_validate": "company ticker symbol"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "kyc_type_i",
              "option_text": "KYC Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "I",
              "validation": []
            }
          ],
          "table": "kyc_details",
          "columns": [
            {
              "company": "company",
              "ticker_symbol": "ticker_symbol",
              "kyc_type_i": "kyc_type_i"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 31,
          "rules": [
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{question_28}}",
              "rule_type": "response",
              "description": "Shows question if the client is insider"
            },
            {
              "value": "my_spouse",
              "value_type": "array",
              "operator": "==",
              "client_data": null,
              "param": "{{spouse_is_insider}}",
              "rule_type": "response",
              "description": "Shows question based on the client's marital status"
            },
            {
              "value": [
                "married",
                "common-law"
              ],
              "value_type": "array",
              "operator": "==",
              "client_data": null,
              "param": "{{marital_status}}",
              "rule_type": "response",
              "description": "Shows question based on the client's marital status"
            }
          ],
          "question_text": "Please tell us about the company where {{SPOUSE_FIRST_NAME}} is an insider or director.",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "company",
              "option_text": "Company details",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Company details",
                "key_validate": "company details"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "ticker_symbol",
              "option_text": "Company ticker symbol",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Company ticker symbol",
                "key_validate": "company ticker symbol"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "kyc_type_i",
              "option_text": "KYC Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "I",
              "validation": []
            }
          ],
          "table": "kyc_details",
          "columns": [
            {
              "company": "company",
              "ticker_symbol": "ticker_symbol",
              "kyc_type_i": "kyc_type_i"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": false,
          "relationship": "SP"
        },
        {
          "id": 499,
          "rules": [
            {
              "value": "someone_else",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{list_relationship_insider}}",
              "rule_type": "response",
              "description": "Shows question based on the client's marital status"
            }
          ],
          "add_relationship": {
            "tag": "{{add_relationship_insider}}"
          },
          "form_insider": true,
          "set_data_response": "modal_add_relationship",
          "question_text": "Who is an insider and/or director of a public listed company?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "multiple-choice-checkbox",
          "type": "multiple-dynamic-options",
          "is_required": true,
          "client_section_data": "['relationships']",
          "filter_section_data": [
            {
              "tag": "{{filter_spouse}}",
              "value": "SP"
            }
          ],
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "add_relationship",
              "option_text": "Add Relationship",
              "title_modal": "Add Relationship",
              "type": "modal_form",
              "value_type": "string",
              "update_relationship": true,
              "compare": true,
              "update_questions": [
                {
                  "id_question": 39,
                  "option": "single-choice-checkbox",
                  "section_pep": true
                }
              ],
              "form_options": [
                {
                  "key_name": "first_name",
                  "option_text": "First name",
                  "type": "text",
                  "attributes": {
                    "placeholder": "First name",
                    "key_validate": "first name"
                  },
                  "value": "",
                  "validation": {
                    "required": true
                  }
                },
                {
                  "key_name": "last_name",
                  "option_text": "Last name",
                  "type": "text",
                  "attributes": {
                    "placeholder": "Last name",
                    "key_validate": "last name"
                  },
                  "value": "",
                  "validation": {
                    "required": true
                  }
                },
                {
                  "filter_marital": true,
                  "key_name": "relationship",
                  "option_text": "Relationship",
                  "type": "dropdown",
                  "attributes": {
                    "placeholder": "Relationship",
                    "key_validate": "relationship"
                  },
                  "value": "",
                  "options": [
                    {
                      "id": 4,
                      "text": "Parent",
                      "value": "PA"
                    },
                    {
                      "id": 11,
                      "text": "Parents Sibling",
                      "value": "PS"
                    },
                    {
                      "id": 5,
                      "text": "Child",
                      "value": "CH"
                    },
                    {
                      "id": 17,
                      "text": "Spouse",
                      "value": "SP"
                    },
                    {
                      "id": 1,
                      "text": "Common-law",
                      "value": "CL"
                    },
                    {
                      "id": 15,
                      "text": "Sibling",
                      "value": "SB"
                    },
                    {
                      "id": 10,
                      "text": "Siblings Child",
                      "value": "SC"
                    },
                    {
                      "id": 12,
                      "text": "Cousin",
                      "value": "CO"
                    },
                    {
                      "id": 16,
                      "text": "Friend",
                      "value": "FR"
                    }
                  ],
                  "validation": {
                    "required": true
                  }
                }
              ],
              "value": "add_relationship",
              "validation": {}
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "kyc_type",
              "option_text": "KYC Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "I",
              "validation": []
            }
          ],
          "table": "kyc_details",
          "columns": [
            {
              "kyc_type": "kyc_type"
            }
          ],
          "responses": [],
          "is_dynamic": true,
          "is_primary_client": false,
          "relationship": ""
        },
        {
          "id": 33,
          "rules": [
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{bool_is_significant_shareholder}}",
              "rule_type": "response",
              "description": "Shows question if the client is significant shareholder"
            }
          ],
          "question_text": "Who is a significant shareholder (>10%) of a publicly listed company?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-multiple-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_significant_shareholder",
              "option_text": "I am a significant shareholder",
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "i_am",
              "validation": [],
              "tag": [
                {
                  "key": "{{is_significant_shareholder}}",
                  "value": true,
                  "verify": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "married",
                    "common-law"
                  ]
                }
              ],
              "key_name": "spouse_is_significant_shareholder",
              "option_text": "My spouse is a significant shareholder",
              "valid_tag": {
                "value": true,
                "tag": "{{marital_status}}"
              },
              "type": "multiple-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "my_spouse",
              "validation": [],
              "tag": [
                {
                  "key": "{{spouse_is_significant_shareholder}}",
                  "value": true,
                  "verify": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "kyc_type_s",
              "option_text": "KYC Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "S",
              "validation": []
            }
          ],
          "table": "clients",
          "columns": [
            {
              "is_significant_shareholder": "is_significant_shareholder",
              "spouse_is_significant_shareholder": "spouse_is_significant_shareholder",
              "kyc_type_s": "kyc_type_s"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 34,
          "rules": [
            {
              "value": "i_am",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{is_significant_shareholder}}",
              "rule_type": "response",
              "description": "Shows question if the client is shareholder"
            },
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{bool_is_significant_shareholder}}",
              "rule_type": "response",
              "description": "Shows question if the client is shareholder"
            }
          ],
          "question_text": "Please tell us about the company of which you are a significant shareholder.",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "company",
              "option_text": "Company details",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Company details",
                "key_validate": "company details"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "ticker_symbol",
              "option_text": "Company ticker symbol",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Company ticker symbol",
                "key_validate": "company ticker symbol"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "approx_percentage_ownership",
              "option_text": "Approximate percentage ownership",
              "type": "number",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Approximate percentage ownership",
                "min": 1,
                "mask": "###",
                "key_validate": "approximate percentage ownership"
              },
              "value": "",
              "validation": {
                "min_value:10": true,
                "max_value:100": true,
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "kyc_type_s",
              "option_text": "KYC Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "S",
              "validation": []
            }
          ],
          "table": "kyc_details",
          "columns": [
            {
              "company": "company",
              "ticker_symbol": "ticker_symbol",
              "approx_percentage_ownership": "approx_percentage_ownership",
              "kyc_type_s": "kyc_type_s"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 35,
          "rules": [
            {
              "value": "my_spouse",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{spouse_is_significant_shareholder}}",
              "rule_type": "response",
              "description": "Shows question if the spouse's client is significant shareholder"
            }
          ],
          "question_text": "Please tell us about the company where {{SPOUSE_FIRST_NAME}} is a significant shareholder.",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "company",
              "option_text": "Company details",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Company details",
                "key_validate": "company details"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "ticker_symbol",
              "option_text": "Company ticker symbol",
              "type": "text",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Company ticker symbol",
                "key_validate": "company ticker symbol"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "approx_percentage_ownership",
              "option_text": "Approximate percentage ownership",
              "type": "number",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Approximate percentage pwnership",
                "min": 1,
                "mask": "###",
                "key_validate": "approximate percentage ownership"
              },
              "value": "",
              "validation": {
                "min_value:10": true,
                "max_value:100": true,
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "kyc_type_s",
              "option_text": "KYC Type",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "value": "S",
              "validation": []
            }
          ],
          "table": "kyc_details",
          "columns": [
            {
              "company": "company",
              "ticker_symbol": "ticker_symbol",
              "approx_percentage_ownership": "approx_percentage_ownership",
              "kyc_type_s": "kyc_type_s"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": false,
          "relationship": "SP"
        }
      ]
    },
    {
      "section_text": "PEP",
      "description": "",
      "attributes": "",
      "questions": [
        {
          "id": 36,
          "rules": [],
          "question_text": "Are you a Political Exposed People (PEP) or a Head of International Organization (HIO)?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-single-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "bool_is_domestic_pep",
              "option_text": "Yes",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": ""
              },
              "value": "true",
              "validation": [],
              "tag": [
                {
                  "key": "{{bool_is_domestic_pep}}",
                  "value": true,
                  "value_key": "true"
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "bool_is_domestic_pep",
              "option_text": "No",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "false",
              "validation": [],
              "tag": [
                {
                  "key": "{{bool_is_domestic_pep}}",
                  "value": true,
                  "value_key": "false"
                }
              ]
            }
          ],
          "table": "persons",
          "columns": [
            {
              "bool_is_domestic_pep": "bool_is_domestic_pep"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 37,
          "rules": [
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{bool_is_domestic_pep}}",
              "rule_type": "response",
              "description": "Shows question if the client is PEP"
            }
          ],
          "question_text": "Please select the type of PEP",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "key_name": "type_of_pep",
              "option_text": "Type of PEP",
              "type": "dropdown",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Type of PEP",
                "key_validate": "type of PEP"
              },
              "value": "",
              "validation": {
                "required": true
              },
              "options": [
                {
                  "id": 1,
                  "text": "Domestic PEP",
                  "value": "is_domestic_pep"
                },
                {
                  "id": 2,
                  "text": "Foreign PEP",
                  "value": "is_foreign_pep"
                },
                {
                  "id": 3,
                  "text": "Head of International Organization",
                  "value": "is_hio"
                }
              ]
            }
          ],
          "table": "persons",
          "columns": [
            {
              "type_of_pep": "type_of_pep"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": true,
          "relationship": ""
        },
        {
          "id": 38,
          "rules": [],
          "question_text": "Are you related to a Political Exposed People (PEP) or a Head of International Organization (HIO)?",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-single-choice",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_domestic_pep_no",
              "option_text": "Yes",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "true",
              "validation": [],
              "tag": [
                {
                  "key": "{{is_domestic_pep_no}}",
                  "value": true
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "is_domestic_pep_no",
              "option_text": "No",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": false,
              "attributes": [],
              "value": "false",
              "validation": [],
              "tag": [
                {
                  "key": "{{is_domestic_pep_no}}",
                  "value": true
                }
              ]
            }
          ],
          "table": "persons",
          "columns": [
            {
              "is_domestic_pep": "is_domestic_pep"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": false,
          "relationship": ""
        },
        {
          "id": 39,
          "rules": [
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{is_domestic_pep_no}}",
              "rule_type": "response",
              "description": "Shows question based on the client's marital status"
            }
          ],
          "add_relationship": {
            "tag": "{{add_relationship_pep}}"
          },
          "question_pep": true,
          "question_text": "Please select the person who is a PEP or HIO.",
          "description": "",
          "image_url": "",
          "dynamic_option_types": "single-choice-checkbox",
          "type": "form-dynamic-options",
          "is_required": true,
          "client_section_data": "['relationships']",
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "add_relationship",
              "option_text": "Add Relationship",
              "type": "single-choice-checkbox",
              "value_type": "string",
              "compare": true,
              "attributes": [],
              "uses_endpoint": false,
              "value": "add_relationship",
              "validation": [],
              "tag": [
                {
                  "key": "{{add_relationship_pep}}",
                  "value": true
                }
              ]
            }
          ],
          "table": "persons",
          "columns": [
            {}
          ],
          "responses": [],
          "is_dynamic": true,
          "is_primary_client": false,
          "relationship": ""
        },
        {
          "id": 40,
          "rules": [
            {
              "value": "add_relationship",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{add_relationship_pep}}",
              "rule_type": "response",
              "description": "Shows question if the client is adding a new relation."
            },
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{is_domestic_pep_no}}",
              "rule_type": "response",
              "description": "Shows question based on the client's marital status"
            }
          ],
          "add_relationship": {
            "tag": "{{add_relationship_pep}}"
          },
          "question_text": "Tell us about the person who is PEP or HIO",
          "form_add_relationship": true,
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "first_name",
              "option_text": "First name",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "First name",
                "key_validate": "first name"
              },
              "value": "['person']['first_name']",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "last_name",
              "option_text": "Last name",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Last name",
                "key_validate": "last name"
              },
              "value": "['person']['last_name']",
              "validation": {
                "required": true
              }
            },
            {
              "key_name": "relationship",
              "option_text": "Relationship",
              "type": "dropdown",
              "value_type": "string",
              "filter_marital": true,
              "compare": true,
              "attributes": {
                "placeholder": "Relationship",
                "key_validate": "relationship"
              },
              "value": "",
              "validation": {
                "required": true
              },
              "options": [
                {
                  "id": 4,
                  "text": "Parent",
                  "value": "PA"
                },
                {
                  "id": 11,
                  "text": "Parents Sibling",
                  "value": "PS"
                },
                {
                  "id": 5,
                  "text": "Child",
                  "value": "CH"
                },
                {
                  "id": 17,
                  "text": "Spouse",
                  "value": "SP"
                },
                {
                  "id": 1,
                  "text": "Common-law",
                  "value": "CL"
                },
                {
                  "id": 15,
                  "text": "Sibling",
                  "value": "SB"
                },
                {
                  "id": 10,
                  "text": "Siblings Child",
                  "value": "SC"
                },
                {
                  "id": 12,
                  "text": "Cousin",
                  "value": "CO"
                },
                {
                  "id": 16,
                  "text": "Friend",
                  "value": "FR"
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "position",
              "option_text": "Position",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Position",
                "key_validate": "position"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "key_name": "type_of_pep",
              "option_text": "Type of PEP",
              "type": "dropdown",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Type of PEP",
                "key_validate": "type of PEP"
              },
              "value": "",
              "validation": {
                "required": true
              },
              "options": [
                {
                  "id": 1,
                  "text": "Domestic PEP",
                  "value": "is_domestic_pep"
                },
                {
                  "id": 2,
                  "text": "Foreign PEP",
                  "value": "is_foreign_pep"
                },
                {
                  "id": 3,
                  "text": "Head of International Organization",
                  "value": "is_hio"
                }
              ]
            }
          ],
          "table": "persons",
          "columns": [
            {
              "first_name": "first_name",
              "middle_name": "middle_name",
              "last_name": "last_name",
              "type_of_pep": "type_of_pep",
              "position": "position"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": false,
          "relationship": ""
        },
        {
          "id": 41,
          "rules": [
            {
              "value": "true",
              "value_type": "string",
              "operator": "==",
              "client_data": null,
              "param": "{{relationship_pep}}",
              "rule_type": "response",
              "description": "Shows question if the client is adding a new relation."
            }
          ],
          "get_relationship_pep": true,
          "question_text": "Tell us about the person who is PEP or HIO",
          "form_add_relationship": true,
          "description": "",
          "image_url": "",
          "dynamic_option_types": "",
          "type": "static-form",
          "is_required": true,
          "client_section_data": null,
          "question_options": [
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "client_id",
              "option_text": "Client",
              "type": "hidden",
              "value_type": "string",
              "compare": true,
              "attributes": {},
              "value": "",
              "validation": {}
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "first_name",
              "option_text": "First name",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "First name",
                "key_validate": "first name"
              },
              "value": "['person']['first_name']",
              "validation": {
                "required": true
              }
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "last_name",
              "option_text": "Last name",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Last name",
                "key_validate": "last name"
              },
              "value": "['person']['last_name']",
              "validation": {
                "required": true
              }
            },
            {
              "key_name": "relationship",
              "option_text": "Relationship",
              "type": "dropdown",
              "filter_marital": false,
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Relationship",
                "key_validate": "relationship",
                "readonly": true
              },
              "value": "",
              "validation": {
                "required": true
              },
              "options": [
                {
                  "id": 4,
                  "text": "Parent",
                  "value": "PA"
                },
                {
                  "id": 11,
                  "text": "Parents Sibling",
                  "value": "PS"
                },
                {
                  "id": 5,
                  "text": "Child",
                  "value": "CH"
                },
                {
                  "id": 17,
                  "text": "Spouse",
                  "value": "SP"
                },
                {
                  "id": 1,
                  "text": "Common-law",
                  "value": "CL"
                },
                {
                  "id": 15,
                  "text": "Sibling",
                  "value": "SB"
                },
                {
                  "id": 10,
                  "text": "Siblings Child",
                  "value": "SC"
                },
                {
                  "id": 12,
                  "text": "Cousin",
                  "value": "CO"
                },
                {
                  "id": 16,
                  "text": "Friend",
                  "value": "FR"
                }
              ]
            },
            {
              "dependencies": [
                {
                  "marital_status": [
                    "single",
                    "married",
                    "common-law",
                    "separated",
                    "divorced",
                    "widowed"
                  ]
                }
              ],
              "key_name": "position",
              "option_text": "Position",
              "type": "text",
              "value_type": "string",
              "compare": false,
              "attributes": {
                "placeholder": "Position",
                "key_validate": "position"
              },
              "value": "",
              "validation": {
                "required": true
              }
            },
            {
              "key_name": "type_of_pep",
              "option_text": "Type of PEP",
              "type": "dropdown",
              "value_type": "string",
              "compare": true,
              "attributes": {
                "placeholder": "Type of PEP",
                "key_validate": "type of PEP"
              },
              "value": "",
              "validation": {
                "required": true
              },
              "options": [
                {
                  "id": 1,
                  "text": "Domestic PEP",
                  "value": "is_domestic_pep"
                },
                {
                  "id": 2,
                  "text": "Foreign PEP",
                  "value": "is_foreign_pep"
                },
                {
                  "id": 3,
                  "text": "Head of International Organization",
                  "value": "is_hio"
                }
              ]
            }
          ],
          "table": "persons",
          "columns": [
            {
              "first_name": "first_name",
              "middle_name": "middle_name",
              "last_name": "last_name",
              "type_of_pep": "type_of_pep",
              "position": "position"
            }
          ],
          "responses": [],
          "is_dynamic": false,
          "is_primary_client": false,
          "relationship": ""
        }
      ]
    }
  ]
}