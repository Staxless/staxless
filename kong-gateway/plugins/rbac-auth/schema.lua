local typedefs = require "kong.db.schema.typedefs"

return {
  name = "rbac-auth",
  fields = {
    { consumer = typedefs.no_consumer },
    { protocols = typedefs.protocols_http },
    { config = {
        type = "record",
        fields = {
          { auth_service_url = typedefs.url { required = true } },
          { required_roles = {
              type = "array",
              elements = { type = "string" },
              required = true,
              default = {}
            },
          },
        },
      },
    },
  },
}
