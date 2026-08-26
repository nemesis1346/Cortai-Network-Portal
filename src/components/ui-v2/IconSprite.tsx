import spriteMarkup from './icons/sprite.svg?raw'

/** Mount once, at the top of the shell — icons then reference symbols via <Icon name="..." />. */
export function IconSprite() {
  return <div style={{ display: 'none' }} aria-hidden dangerouslySetInnerHTML={{ __html: spriteMarkup }} />
}
