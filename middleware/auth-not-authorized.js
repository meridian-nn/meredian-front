export default function(context) {
  const hasSession = context.store.getters['auth/hasSession']

  if (!hasSession) {
    return context.redirect('/meridian/auth/login')
  }
}
