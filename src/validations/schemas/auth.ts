
export const body = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6, maxLength: 64 }
  },
  required: ["email", "password"],
  additionalProperties: false
}


// export const studentSignup = {
//   type: "object",

// }