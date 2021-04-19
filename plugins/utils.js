export default function(ctx, inject) {
  const numOr0 = n => isNaN(parseFloat(n)) ? 0 : parseFloat(n)
  ctx.numOr0 = numOr0
  inject('numOr0', numOr0)
}
