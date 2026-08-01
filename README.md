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
