# Continuous Integration (CI) / Continuous Deployment (CD) Docs

All CI/CD pipelines are implemented as GitHub workflow actions in `.github/workflows`. Details regarding the deployed infrastructure is available here (will be updated when available).

Available Environments:

- Preview
  - PR-specific Vercel frontend deployments that use the `Staging` backend environment.
  - URL: `[branch-name].preview.coursetable.com`
- Staging
  - `master` tracking Vercel frontend and Azure Container Group (ACI) deployments. MySQL DB is overwritten by production MySQL data daily.
  - URL:
    - Frontend: [staging.coursetable.com](https://staging.coursetable.com)
    - Backend: [api.staging.coursetable.com](https://api.staging.coursetable.com/ping)
- Production
  - Asynchronously tracking deploys of `master` on approval from a team lead.
  - URL:
    - Frontend: [coursetable.com](https://coursetable.com)
    - Backend: [api.coursetable.com](https://api.coursetable.com/ping)

## [CI](../.github/workflows/ci.yml)

Runs formatting, linting, and dependency checks. Required as a check for merging PRs.

- Trigger: PR and `master` commit
- Environment: Preview, Staging, Production

## [Preview CD](../.github/workflows/preview_cd.yml)

Deploys **frontend only** to Vercel and assigns unique preview link to each commit and each PR. Required as a check for merging PRs.

- Trigger: PR commit
- Environment: Preview

## [Staging CD](../.github/workflows/staging_cd.yml) - In Progress

Deploys both frontend to Vercel and backend to the staging API Docker Network. Builds latest Docker images and refreshes containers in-place. Allows for sanity-checking and robust testing of new commits before deploying to production.

- Trigger: `master` commit
- Environment: Staging

## [Production CD](../.github/workflows/cd.yml) - Planned

Deploys both frontend to Vercel and backend to production API Docker Network. Builds latest Docker images and refreshes containers. in-place.

- Trigger: `master` commit with team lead approval
- Environment: Production
