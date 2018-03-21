/**
 * @typedef Card
 * @type {object}
 * @property {CardHeader} header
 * @property {Array<CardSection>} sections
 */
/**
 * @typedef CardHeader
 * @type {object}
 * @property {string} title
 * @property {string} subtitle
 * @property {undefined | '' | IMAGE' | 'AVATAR'} imageStyle
 * @property {?string} imageUrl
 */
/**
 * @typedef CardSection
 * @type {object}
 * @property {string} header
 * @property {Array<TextWidget | ImageWidget | KeyValueWidget>} widgets
 */
/**
 * @typedef TextWidget
 * @type {object}
 * @property {string} text
 */
/**
 * @typedef ImageWidget
 * @type {object}
 * @property {string} imageUrl
 * @property {?number} aspectRatio
 */

/**
 * Creates a card object
 * @param {Card} param0
 * @returns {Card}
 */
export function createCard({ header = {}, sections = [] }) {
  return { header, sections };
}

/**
 * Creates a card header
 * @param {CardHeader} param0
 * @returns {CardHeader}
 */
export function createCardHeader({
  title = '',
  subtitle = '',
  imageStyle = undefined,
  imageUrl = undefined
}) {
  if (!imageStyle || !imageUrl) {
    return { title, subtitle };
  }
  return { title, subtitle, imageStyle, imageUrl };
}

/**
 * Creates a section of a card
 * @param {CardSection} param0
 */
export function createSection({ header = '', widgets = [] }) {
  return { header, widgets };
}

/**
 * Creates a text widget
 * @param {string} text
 * @returns {TextWidget}
 */
export function createTextParagraphWidget(text) {
  return { textParagraph: { text } };
}

/**
 * Creates an image widget
 * @param {ImageWidget} param0
 * @returns {ImageWidget}
 */
export function createImageWidget({ imageUrl = '', aspectRatio = undefined }) {
  if (aspectRatio) {
    return { image: { imageUrl, aspectRatio } };
  }
  return { image: { imageUrl } };
}
