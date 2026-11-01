export function isPublishedProduction(context) {
  // A verified draft promoted by the API retains its original deploy context.
  // Netlify's trusted published flag identifies the one current live release.
  return context?.deploy?.published === true
}
