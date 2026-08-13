# Sports Store Frontend

React/Vite storefront. In AWS production, the validated `main` workflow publishes `dist/` to a private Terraform-managed S3 bucket and CloudFront serves it through signed Origin Access Control requests. S3 is the source origin, not a backup. The frontend uses same-origin `/api` URLs, which CloudFront sends to the ALB without API caching.

## Development

```sh
npm ci
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`. No automated test script is currently defined.

## Docker

```sh
docker build -t sports-store/frontend:0.1.0 .
docker run --rm -p 8081:80 sports-store/frontend:0.1.0
```

The NGINX container remains supported for local development, Minikube, Docker Compose, and CI validation. Direct local navigation uses its SPA fallback; in AWS, a CloudFront Function performs the equivalent extensionless-route rewrite. The container intentionally does not proxy `/api`.

## Observability

NGINX writes minimal one-line JSON access logs to stdout without URLs, query
strings, headers, cookies, or bodies. A loopback-only `stub_status` listener is
available to the Kubernetes exporter sidecar; it is not part of the image's
public port or routes.

## Continuous integration

Pull requests targeting `main` run clean dependency installation, ESLint, Vitest, a production build, Dockerfile lint, a non-publishing container build, and pinned filesystem/image Trivy scans. Pushes to `main` repeat validation, authenticate through GitHub OIDC, rebuild, and synchronize the result to the exact private bucket. Stale objects are deleted, hashed `/assets/*` receive immutable one-year caching, and `index.html` plus other entry files use `no-cache`; no CloudFront invalidation is required.

Configure `AWS_REGION`, `AWS_STATIC_SITE_ROLE_ARN`, and `AWS_STATIC_SITE_BUCKET` as Actions variables. The role ARN and bucket name are non-secret configuration; no static AWS keys are stored. Publication runs only for a push to `main`, never for a pull request, dispatch, or `NivBranch`. The first `main` run can fail before base Terraform creates the bucket and role; `deploy.sh` configures the variables and performs the controlled rerun. The AWS frontend Pod is intentionally disabled, while container validation remains part of CI.
