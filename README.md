# Sports Store Frontend

React/Vite storefront. In production, this repository builds independently and an NGINX container serves the generated `dist` files on port `80` with SPA fallback to `index.html`. The frontend uses same-origin `/api` URLs; API proxying belongs to the separate gateway.

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

Direct navigation to React Router paths is handled by the frontend NGINX fallback. This container intentionally does not proxy `/api`.

## Continuous integration

Pull requests targeting `main` run dependency installation, the production build, and a non-publishing container build. No test command is invented because this repository currently has no test script. Pushes to `main` repeat validation, authenticate to AWS through GitHub OIDC, and publish exactly one immutable ECR image tagged `<VERSION>-<7-character-git-hash>`.

`VERSION` is the semantic-version source and is changed deliberately through a pull request. Configure the Actions variables `AWS_REGION` and `AWS_ECR_PUBLISH_ROLE_ARN` at repository or organization scope. The role ARN is configuration, not a secret; no static AWS credentials are stored. CI publishes only to ECR and does not deploy to EKS. Deployment is handled later through Argo CD.
