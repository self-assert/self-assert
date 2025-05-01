# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [0.7.2] - 2025-05-01

### Added

- `SectionDraftAssistant.routeBrokenRulesOf`. See **deprecated** below.
- `SectionDraftAssistant.routeBrokenRule`. See **deprecated** below.

### Deprecated

- `DateDraftAssistant` class.
- `SectionDraftAssistant.routeFailedAssertionsOf`. Replaced by `routeBrokenRulesOf`
  for consistency.
- `SectionDraftAssistant.routeFailedAssertion`. Replaced by `routeBrokenRule`
  for consistency.
