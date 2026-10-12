# awm physics

A central gallery for the interactive physics simulations published at
[`alexmoorephysics.com`](https://alexmoorephysics.com/).

## Publish it on GitHub Pages

1. On GitHub, create a public repository named `awm11.github.io`.
2. Upload or push the contents of this folder to the repository's `main` branch.
3. Open **Settings → Pages** and choose **GitHub Actions** as the source.
4. The included workflow builds and publishes the site automatically at
   `https://alexmoorephysics.com/`.

## Add another simulation

1. Add a screenshot to `public/previews/` as `<slug>.webp`, about 800 px wide
   (keeps the gallery page light).
2. Add its title, link, description, category and tags to the `simulations`
   array in `app/page.tsx`.
3. Push to `main`; GitHub Actions rebuilds and publishes the gallery.

## Local preview

```sh
npm install
npm run dev
```