# [2.0.0](https://github.com/Staxless/staxless/compare/v1.39.0...v2.0.0) (2026-01-31)


* feat!: transition backend services to event-based architecture ([2a3b6d4](https://github.com/Staxless/staxless/commit/2a3b6d45e937044c67017ad0521614c4f6806156))


### Bug Fixes

* correct regex to include base route ([a29bf5a](https://github.com/Staxless/staxless/commit/a29bf5a0b928cf51f52397ed31ce0a25aeccb291))
* **frontend:** correct api path ([3c0870b](https://github.com/Staxless/staxless/commit/3c0870bbb2b21697a82a64739f585032909508ca))
* **frontend:** correct mobile menu brand config ([fbbc63e](https://github.com/Staxless/staxless/commit/fbbc63e972828191ea2e9d6f56c1226483cc4501))
* **frontend:** correct waitlist brand config ([ac3a4d7](https://github.com/Staxless/staxless/commit/ac3a4d707d11776fbb2312eed93ba46ae67318a6))
* **frontend:** use environment variable for api gateway url in production ([ddedabb](https://github.com/Staxless/staxless/commit/ddedabbb6da96ce07a01dbe29889a36d8e42e993))
* **linting:** restore deleted code from linting ([fd0f097](https://github.com/Staxless/staxless/commit/fd0f097f196369ad18dc1206075bd3c551103e60))
* reset brand config to template ([95b17f3](https://github.com/Staxless/staxless/commit/95b17f3265646494951d8e60fc11a4ebd464030c))
* resolve RSC serialization errors and email service issues ([0529724](https://github.com/Staxless/staxless/commit/0529724c857438e694fc8ef2d5f8f2ce02901f71)), closes [#pricing](https://github.com/Staxless/staxless/issues/pricing)
* **tailwind:** correct path for global CSS file and ensure package manager is specified ([0d54d71](https://github.com/Staxless/staxless/commit/0d54d710254161940a189f5205b4d1b416346886))
* update @staxless/cli dependency to ^2.0.1 ([824ab3d](https://github.com/Staxless/staxless/commit/824ab3d96c01f723047ddf278e2aff9956de0921))
* update admin route destination to correct port ([43cef73](https://github.com/Staxless/staxless/commit/43cef73383d4616d8a91a9084368be3334068797))


### Features

* add production deployment infrastructure with GitHub Actions ([0a06d66](https://github.com/Staxless/staxless/commit/0a06d66ae3c3b587bbd7569247a5156b70e48e5c))
* Add subscription support alongside one-time payments ([8efc52d](https://github.com/Staxless/staxless/commit/8efc52df7c242aa2fcc2a1e00d0389a8c8eb5869))
* **auth-service:** refactor OAuth providers with secrets manager, dynamic redirects & enhanced security ([a51268e](https://github.com/Staxless/staxless/commit/a51268e774af75652aa505d751ec3ebcdca41169))
* **auth-service:** update magic link and oauth configuration ([1c3d139](https://github.com/Staxless/staxless/commit/1c3d13915cdef9933bf411b838e930e7cba1c89b))
* **cookie-store:** add TypeScript interfaces for cookie store management ([512f70c](https://github.com/Staxless/staxless/commit/512f70cb64a450f3a507ebac720a10c5ccf8ec52))
* enable prefetch admin dashboard to reduce cold starts ([9b7e8ba](https://github.com/Staxless/staxless/commit/9b7e8ba6dd5999c63c23dadf3d044036432f0bd6))
* **frontend:** add centered settings dialog with account and subscription sections ([44f5487](https://github.com/Staxless/staxless/commit/44f5487a59581fca8302eb5e072d024dc78e604f))
* **frontend:** add centralized error handling system ([7ecd32d](https://github.com/Staxless/staxless/commit/7ecd32d20f79268f450eea2b2313e1e05b7b6b61))
* **frontend:** add centralized user context for auth state management ([54a5cb4](https://github.com/Staxless/staxless/commit/54a5cb4356af66afd166c1a473e61c8803ee627f))
* **frontend:** add comprehensive loading states with skeletons ([84ea208](https://github.com/Staxless/staxless/commit/84ea2089fa9e24b588cc50fc5e550bc07078c711))
* **frontend:** add error and not-found pages with brand styling ([5486489](https://github.com/Staxless/staxless/commit/5486489f96c70becd17dfc6cb9d0e2586ba10927))
* **frontend:** enhance magic link auth flow with proper UX ([3f98358](https://github.com/Staxless/staxless/commit/3f98358d90364221fb8372faf37592c7485eb502))
* **frontend:** optimize logout with instant redirect and clear state ([cfa4130](https://github.com/Staxless/staxless/commit/cfa41304b02d268cdcb34b73bb7a0b826d0b4136))
* **frontend:** replace home page with modular sales components ([2873403](https://github.com/Staxless/staxless/commit/2873403e27262625ed104fe084ca02e29181911d))
* **frontend:** simplify checkout and pricing with unified layout ([317bd1d](https://github.com/Staxless/staxless/commit/317bd1d89a4cc86eb8b1e233d57e48582e6cfb0f))
* **frontend:** update auth forms and provider hook ([9bc1589](https://github.com/Staxless/staxless/commit/9bc158950e0f8cb5ab5d1d289512525b2d320522))
* **frontend:** update dashboard settings components ([6ec141e](https://github.com/Staxless/staxless/commit/6ec141e000a5a45f57ee607945a12e5a473e939c))
* **frontend:** update middleware with improved route handling ([b0b3bc9](https://github.com/Staxless/staxless/commit/b0b3bc954f3b4e73afc04665e5cffc44b44e5719))
* **frontend:** update ui components with brand config styling ([ec0fe36](https://github.com/Staxless/staxless/commit/ec0fe36f33a1e4219b0eb44a6db2edd5324eb2d2))
* **health:** add health check endpoint returning status ([d023862](https://github.com/Staxless/staxless/commit/d023862ded8e20c34b8905e73ea0ce1b5482df06))
* Implement blog post functionality ([9e30cd7](https://github.com/Staxless/staxless/commit/9e30cd71e217c430f1136119b1ab9edeb6fa4a6e))
* implement email service with templated email support and Mailgun client integration ([ec644b7](https://github.com/Staxless/staxless/commit/ec644b72aa83e1c3aec966715ecc927d08d444da))
* implement RBAC with Kong plugin, add rate limiting, timeout, and CORS configuration ([0bbcf7d](https://github.com/Staxless/staxless/commit/0bbcf7d962cf9c145408017e2222d372ad033d4b))
* **public:** add favicon, logo image, and SVG icon for branding ([187529c](https://github.com/Staxless/staxless/commit/187529cfebb7895059bdf3082c7c2b22fb7263c0))
* **secrets:** implement secure secret loader with caching and error handling for production ([6607f8c](https://github.com/Staxless/staxless/commit/6607f8cf61359148e66e0254746f7c82a00ae3a1))
* **services:** update kong gateway and service routes ([ce31e49](https://github.com/Staxless/staxless/commit/ce31e4908d58330e581f85e3889bc885f2eaee00))
* **tailwind:** update Tailwind CSS configuration and update related files ([a5f3d93](https://github.com/Staxless/staxless/commit/a5f3d9370ee1be3e9fe826a6d5d58a8b634b0489))


### BREAKING CHANGES

* Replaced direct API calls with Kafka-based event-driven communication, requiring updates to client integrations and service configurations.

# [2.0.0](https://github.com/Staxless/staxless/compare/v1.39.0...v2.0.0) (2026-01-19)


* feat!: transition backend services to event-based architecture ([2a3b6d4](https://github.com/Staxless/staxless/commit/2a3b6d45e937044c67017ad0521614c4f6806156))


### Bug Fixes

* correct regex to include base route ([a29bf5a](https://github.com/Staxless/staxless/commit/a29bf5a0b928cf51f52397ed31ce0a25aeccb291))
* **frontend:** correct api path ([3c0870b](https://github.com/Staxless/staxless/commit/3c0870bbb2b21697a82a64739f585032909508ca))
* **frontend:** correct mobile menu brand config ([fbbc63e](https://github.com/Staxless/staxless/commit/fbbc63e972828191ea2e9d6f56c1226483cc4501))
* **frontend:** correct waitlist brand config ([ac3a4d7](https://github.com/Staxless/staxless/commit/ac3a4d707d11776fbb2312eed93ba46ae67318a6))
* **linting:** restore deleted code from linting ([fd0f097](https://github.com/Staxless/staxless/commit/fd0f097f196369ad18dc1206075bd3c551103e60))
* reset brand config to template ([95b17f3](https://github.com/Staxless/staxless/commit/95b17f3265646494951d8e60fc11a4ebd464030c))
* **tailwind:** correct path for global CSS file and ensure package manager is specified ([0d54d71](https://github.com/Staxless/staxless/commit/0d54d710254161940a189f5205b4d1b416346886))
* update admin route destination to correct port ([43cef73](https://github.com/Staxless/staxless/commit/43cef73383d4616d8a91a9084368be3334068797))


### Features

* add production deployment infrastructure with GitHub Actions ([0a06d66](https://github.com/Staxless/staxless/commit/0a06d66ae3c3b587bbd7569247a5156b70e48e5c))
* Add subscription support alongside one-time payments ([8efc52d](https://github.com/Staxless/staxless/commit/8efc52df7c242aa2fcc2a1e00d0389a8c8eb5869))
* **auth-service:** refactor OAuth providers with secrets manager, dynamic redirects & enhanced security ([a51268e](https://github.com/Staxless/staxless/commit/a51268e774af75652aa505d751ec3ebcdca41169))
* **cookie-store:** add TypeScript interfaces for cookie store management ([512f70c](https://github.com/Staxless/staxless/commit/512f70cb64a450f3a507ebac720a10c5ccf8ec52))
* enable prefetch admin dashboard to reduce cold starts ([9b7e8ba](https://github.com/Staxless/staxless/commit/9b7e8ba6dd5999c63c23dadf3d044036432f0bd6))
* **frontend:** add centralized error handling system ([7ecd32d](https://github.com/Staxless/staxless/commit/7ecd32d20f79268f450eea2b2313e1e05b7b6b61))
* **frontend:** add comprehensive loading states with skeletons ([84ea208](https://github.com/Staxless/staxless/commit/84ea2089fa9e24b588cc50fc5e550bc07078c711))
* **frontend:** enhance magic link auth flow with proper UX ([3f98358](https://github.com/Staxless/staxless/commit/3f98358d90364221fb8372faf37592c7485eb502))
* **health:** add health check endpoint returning status ([d023862](https://github.com/Staxless/staxless/commit/d023862ded8e20c34b8905e73ea0ce1b5482df06))
* Implement blog post functionality ([9e30cd7](https://github.com/Staxless/staxless/commit/9e30cd71e217c430f1136119b1ab9edeb6fa4a6e))
* implement email service with templated email support and Mailgun client integration ([ec644b7](https://github.com/Staxless/staxless/commit/ec644b72aa83e1c3aec966715ecc927d08d444da))
* implement RBAC with Kong plugin, add rate limiting, timeout, and CORS configuration ([0bbcf7d](https://github.com/Staxless/staxless/commit/0bbcf7d962cf9c145408017e2222d372ad033d4b))
* **public:** add favicon, logo image, and SVG icon for branding ([187529c](https://github.com/Staxless/staxless/commit/187529cfebb7895059bdf3082c7c2b22fb7263c0))
* **secrets:** implement secure secret loader with caching and error handling for production ([6607f8c](https://github.com/Staxless/staxless/commit/6607f8cf61359148e66e0254746f7c82a00ae3a1))
* **tailwind:** update Tailwind CSS configuration and update related files ([a5f3d93](https://github.com/Staxless/staxless/commit/a5f3d9370ee1be3e9fe826a6d5d58a8b634b0489))


### BREAKING CHANGES

* Replaced direct API calls with Kafka-based event-driven communication, requiring updates to client integrations and service configurations.

# [2.0.0](https://github.com/Staxless/staxless/compare/v1.39.0...v2.0.0) (2026-01-18)


* feat!: transition backend services to event-based architecture ([2a3b6d4](https://github.com/Staxless/staxless/commit/2a3b6d45e937044c67017ad0521614c4f6806156))


### Bug Fixes

* correct regex to include base route ([a29bf5a](https://github.com/Staxless/staxless/commit/a29bf5a0b928cf51f52397ed31ce0a25aeccb291))
* **linting:** restore deleted code from linting ([fd0f097](https://github.com/Staxless/staxless/commit/fd0f097f196369ad18dc1206075bd3c551103e60))
* reset brand config to template ([95b17f3](https://github.com/Staxless/staxless/commit/95b17f3265646494951d8e60fc11a4ebd464030c))
* **tailwind:** correct path for global CSS file and ensure package manager is specified ([0d54d71](https://github.com/Staxless/staxless/commit/0d54d710254161940a189f5205b4d1b416346886))
* update admin route destination to correct port ([43cef73](https://github.com/Staxless/staxless/commit/43cef73383d4616d8a91a9084368be3334068797))


### Features

* add production deployment infrastructure with GitHub Actions ([0a06d66](https://github.com/Staxless/staxless/commit/0a06d66ae3c3b587bbd7569247a5156b70e48e5c))
* Add subscription support alongside one-time payments ([8efc52d](https://github.com/Staxless/staxless/commit/8efc52df7c242aa2fcc2a1e00d0389a8c8eb5869))
* **auth-service:** refactor OAuth providers with secrets manager, dynamic redirects & enhanced security ([a51268e](https://github.com/Staxless/staxless/commit/a51268e774af75652aa505d751ec3ebcdca41169))
* **cookie-store:** add TypeScript interfaces for cookie store management ([512f70c](https://github.com/Staxless/staxless/commit/512f70cb64a450f3a507ebac720a10c5ccf8ec52))
* enable prefetch admin dashboard to reduce cold starts ([9b7e8ba](https://github.com/Staxless/staxless/commit/9b7e8ba6dd5999c63c23dadf3d044036432f0bd6))
* **health:** add health check endpoint returning status ([d023862](https://github.com/Staxless/staxless/commit/d023862ded8e20c34b8905e73ea0ce1b5482df06))
* Implement blog post functionality ([9e30cd7](https://github.com/Staxless/staxless/commit/9e30cd71e217c430f1136119b1ab9edeb6fa4a6e))
* implement email service with templated email support and Mailgun client integration ([ec644b7](https://github.com/Staxless/staxless/commit/ec644b72aa83e1c3aec966715ecc927d08d444da))
* implement RBAC with Kong plugin, add rate limiting, timeout, and CORS configuration ([0bbcf7d](https://github.com/Staxless/staxless/commit/0bbcf7d962cf9c145408017e2222d372ad033d4b))
* **public:** add favicon, logo image, and SVG icon for branding ([187529c](https://github.com/Staxless/staxless/commit/187529cfebb7895059bdf3082c7c2b22fb7263c0))
* **secrets:** implement secure secret loader with caching and error handling for production ([6607f8c](https://github.com/Staxless/staxless/commit/6607f8cf61359148e66e0254746f7c82a00ae3a1))
* **tailwind:** update Tailwind CSS configuration and update related files ([a5f3d93](https://github.com/Staxless/staxless/commit/a5f3d9370ee1be3e9fe826a6d5d58a8b634b0489))


### BREAKING CHANGES

* Replaced direct API calls with Kafka-based event-driven communication, requiring updates to client integrations and service configurations.

# [2.0.0](https://github.com/Staxless/staxless/compare/v1.40.0...v2.0.0) (2025-06-25)


* feat!: transition backend services to event-based architecture ([2a3b6d4](https://github.com/Staxless/staxless/commit/2a3b6d45e937044c67017ad0521614c4f6806156))


### Bug Fixes

* update admin route destination to correct port ([43cef73](https://github.com/Staxless/staxless/commit/43cef73383d4616d8a91a9084368be3334068797))


### BREAKING CHANGES

* Replaced direct API calls with Kafka-based event-driven communication, requiring updates to client integrations and service configurations.

# [1.40.0](https://github.com/Staxless/staxless/compare/v1.39.0...v1.40.0) (2025-06-25)


### Features

* implement email service with templated email support and Mailgun client integration ([ec644b7](https://github.com/Staxless/staxless/commit/ec644b72aa83e1c3aec966715ecc927d08d444da))
* implement RBAC with Kong plugin, add rate limiting, timeout, and CORS configuration ([0bbcf7d](https://github.com/Staxless/staxless/commit/0bbcf7d962cf9c145408017e2222d372ad033d4b))

# [1.39.0](https://github.com/Staxless/staxless/compare/v1.38.0...v1.39.0) (2025-06-17)


### Features

* Add brand utilities and style presets for enhanced theming ([88af6f3](https://github.com/Staxless/staxless/commit/88af6f36235a0126d37f823975076a75b5ba9dc0))
* add magic link routes to gateway ([bc0729f](https://github.com/Staxless/staxless/commit/bc0729f8c23b3b35b0fa1bf986bb4e384c1c4ad0))

# [1.38.0](https://github.com/Staxless/staxless/compare/v1.37.2...v1.38.0) (2025-06-12)


### Features

* Setup automated CI/CD releases with GitHub Actions ([b5f525b](https://github.com/Staxless/staxless/commit/b5f525b4eb97d7c46b370ec51fb293b83a8c01ae))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
