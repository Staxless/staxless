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
