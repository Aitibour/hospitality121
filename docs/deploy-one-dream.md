# Deploy Hospitality121 to the One Dream Netlify account

Repository: https://github.com/Aitibour/hospitality121.git

The repository includes the Next.js source, MDX articles, public images and assets, package-lock.json, Netlify functions and their libraries, security headers, build configuration, and GitHub workflows. The privacy page and its footer link are included. Netlify generates the website output during the build; node_modules and out do not belong in Git.

## 1. Import the repository

1. Sign in to Netlify with onedreamimmigration69@gmail.com and select One Dream Immigration's team.
2. Choose Add new project, then Import an existing project, and select GitHub.
3. Authorize access to Aitibour/hospitality121 if prompted. Select that repository and the main branch.
4. Keep the base directory empty, build command npm run build, publish directory out, and functions directory netlify/functions. These settings are already in netlify.toml. Netlify installs the locked dependencies before building.
5. Deploy and inspect the new netlify.app address before changing the custom domain. If the project starts private, make the intended production site public when ready.

No private API keys are required to build the existing articles and pages. A GitHub repository ZIP is source code, not a built website: importing GitHub deploys the functions too, while dropping only an out folder does not install the backend or configure automation.

## 2. Configure services separately

Secrets and account data are not stored in this repository and do not transfer when a new project is created. Copy the required environment variables securely from the existing site's Netlify environment settings into the new project's environment settings. Never paste their values into GitHub files, issues, or commits.

| Feature | Configuration |
| --- | --- |
| Existing pages, articles, photos, privacy page | Included in Git; no secret needed |
| Newsletter | NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID has the current public default in next.config.ts; use the existing Beehiiv account |
| Analytics | NEXT_PUBLIC_GA_ID, if analytics is wanted |
| AdSense | NEXT_PUBLIC_ADSENSE_CLIENT, if advertising is wanted |
| RSS headline function and article views | Function source included; Netlify provisions the runtime; existing Netlify Blobs data is project-specific and is not in Git |
| Contact form | Enable/check Netlify Forms detection and test a real submission; existing submissions and notification settings do not copy from the old project |
| X scheduling | BUFFER_API_KEY, BUFFER_X_CHANNEL_ID, BUFFER_ORGANIZATION_ID, X_ACCOUNT_ID, SOCIAL_AUTOMATION_SECRET, X_PUBLISH_PROVIDER=buffer; leave X_AUTOMATION_ENABLED unset until migration is complete |
| Social health endpoint | SOCIAL_AUTOMATION_SECRET and the Buffer configuration above; optional LinkedIn health also uses BUFFER_LINKEDIN_CHANNEL_ID, LINKEDIN_ACCOUNT_ID, LINKEDIN_AUTOMATION_ENABLED |
| Cloud article generation | Existing GitHub Actions secrets GROQ_API_KEY and PEXELS_API_KEY; these belong to the GitHub repository and need not be put in Netlify for a normal site build |

Verify the original settings before copying optional services. A new Netlify project has separate Blobs stores, view counts, function state, and form submissions. In particular, empty social publication state can cause duplicate posts: migrate the relevant state or review it before enabling social schedules. The LinkedIn Buffer publisher also runs separately in GitHub Actions; do not start a second copy.

## 3. Move hospitality121.com after the preview works

The original project currently owns the custom-domain attachment. Netlify will require that attachment to be removed or transferred before the same domain can be attached to the new project. Keep the existing project running until the new netlify.app deployment has been tested. Move the domain in Netlify's domain settings, follow the exact DNS records shown for the new project, and verify HTTPS for hospitality121.com and www.hospitality121.com. If the DNS zone itself is owned by the original team, that ownership may also need a separate transfer or support assistance. Do not delete the old project to free the domain.

The site intentionally retains https://hospitality121.com in canonical links, RSS, sitemaps, and scheduled social worker URLs. Test the new deployment, then move the domain before enabling production social scheduling.

## 4. Point the cloud publisher at the new project

Importing GitHub deploys the site, but the separate Cloud editorial publisher workflow also deploys through the Netlify API. Update its target after creating the new project:

1. Copy the new Project ID from Netlify Project configuration, General, Project information.
2. In GitHub repository Settings, Secrets and variables, Actions, Variables, create NETLIFY_SITE_ID with that new Project ID.
3. In the Secrets tab, update NETLIFY_AUTH_TOKEN with a token from the One Dream Netlify account that can access the new project. Keep this token private.
4. The deployment and production-publishing scripts both honor NETLIFY_SITE_ID. Until that variable is set, they preserve the existing project's target for compatibility. A team slug or website URL is not a Project ID.
5. Check that a cloud workflow run publishes to the new project. Preview verification rejects a deploy belonging to another project. Domain-based live verification expects hospitality121.com to serve the new deployment, so complete the domain move first.

Do not run the older setup-buffer-cloud.mjs or setup-linkedin-buffer.mjs account setup utilities during this migration: those historical one-off scripts target earlier accounts. Configure the new project's environment variables directly as described above.

## 5. Verify the release

- Build and deployment finish successfully with functions present.
- Homepage, /news, /privacy, and /content/andaz-gold-coast-opening load, and the footer exposes Privacy Policy on mobile and desktop.
- Images, RSS feed (/feed.xml), sitemap (/sitemap.xml), newsletter, and contact form work.
- Functions respond correctly, and social schedules remain disabled until credentials, domain routing, and publication state are ready.
- The GitHub cloud publisher targets the new Project ID and account token.

This creates a new project in the One Dream account; it does not transfer the original project's deployment history, service credentials, billing, or stored data. Existing account plan and credit limits still apply.
