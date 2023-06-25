# Press

Press aims to be a universal CMS that you can use for creating content for your site.

With tenant capabilities, it allows you to create content for a number of sites with a multi-user, multi-site structure. Alongside that, it fully supports site deployments and site management with CloudFlare and Vercel.

## Tech

- [Using the Next.JS Framework (App Directory)](https://nextjs.org/)
- [Components from shadcn](https://ui.shadcn.com/)
- [Hosted on Vercel](https://vercel.com/)
- [Emails with Resend](https://resend.com/)
- [Database with PlanetScale](https://planetscale.com/)

## TODO

- [x] Implement models for CMS
- [ ] Implement multi tenant structure
- [ ] Move billing to tenants
- [ ] Implement audit logs
- [ ] Implement flags
- [ ] Implement content creation with statuses, types and workflows
  - [ ] Implement simple content editor
  - [ ] Implement custom templates with custom fields
- [ ] Implement sites with deployment and management
  - [ ] Implement CloudFlare
  - [ ] Implement Vercel
- [ ] Implement forms
- [ ] Implement content upload
- [ ] Implement user configuration
  - [ ] Implement sign in and device tracking
  - [ ] Implement delete account and site
  - [ ] Implement SAR
- [ ] Implement external integrations
- [ ] Implement content compliance tracking

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following command:

```
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```
