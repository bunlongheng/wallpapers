# Security Policy

## Supported versions

The `main` branch is the only supported version.

## Reporting a vulnerability

Please report privately through GitHub's
[private vulnerability reporting](https://github.com/bunlongheng/wallpapers/security/advisories/new)
rather than opening a public issue.

Expect an acknowledgement within a few days.

## Scope

This is a fully static site. It has no database, no API routes, no authentication, no
forms, and no user accounts, so the realistic surface is small: the response headers set
in `next.config.ts`, the `[id]` path segment (validated at build by
`generateStaticParams` plus `dynamicParams = false`), and the dependency tree.

Known and accepted: `script-src` keeps `'unsafe-inline'` because every page is
statically prerendered and Next inlines its own hydration payload, which a nonce would
require per-request middleware to replace. `'unsafe-eval'` is added only in the
development phase, never in a production build.
