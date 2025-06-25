-- Custom Kong RBAC Authentication Plugin
-- Enforces role-based access control by validating sessions with the auth service

local http = require "resty.http"
local cjson = require "cjson"
local kong = kong

local function get_cookie(name, cookies)
  if not cookies then return nil end
  local pattern = name .. "=([^;]+)"
  return cookies:match(pattern)
end

local function validate_session(auth_service_url, session_id)
  local httpc = http.new()
  local res, err = httpc:request_uri(auth_service_url .. "/auth/validate-request", {
    method = "POST",
    headers = {
      ["Content-Type"] = "application/json",
      ["Cookie"] = "auth_session=" .. session_id
    },
    body = "{}",
    keepalive_timeout = 60,
    keepalive_pool = 10
  })

  if not res then
    kong.log.err("Failed to validate session: ", err)
    return nil, "Internal server error"
  end

  if res.status ~= 200 then
    return nil, "Invalid or expired session"
  end

  local body, decode_err = cjson.decode(res.body)
  if not body then
    kong.log.err("Failed to decode response: ", decode_err)
    return nil, "Internal server error"
  end

  return body.user, nil
end

local function check_route_permissions(user_roles, required_roles)
  if not user_roles or not required_roles then return false end

  for _, required_role in ipairs(required_roles) do
    for _, user_role in ipairs(user_roles) do
      if user_role == required_role then
        return true
      end
    end
  end
  return false
end

local RBACAuthHandler = {
  PRIORITY = 1000,
  VERSION = "1.0.0",
}

function RBACAuthHandler:access(conf)
  local cookies = kong.request.get_header("cookie")
  local session_id = get_cookie("auth_session", cookies)

  if not session_id then
    return kong.response.exit(401, { error = "Authentication required" })
  end

  local user, err = validate_session(conf.auth_service_url, session_id)
  if not user then
    return kong.response.exit(401, { error = err or "Unauthorized" })
  end

  local required_roles = conf.required_roles or {}
  if #required_roles > 0 then
    local has_permission = check_route_permissions(user.roles, required_roles)
    if not has_permission then
      return kong.response.exit(403, { error = "Insufficient permissions" })
    end
  end

  kong.service.request.set_header("x-user-info", cjson.encode({
    user_id = user.id,
    email = user.email,
    roles = user.roles,
    name = user.name
  }))
end

return RBACAuthHandler
