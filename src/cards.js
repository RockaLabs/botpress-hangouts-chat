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
 * @typedef KeyValueWidget
 * @type {object}
 * @property {string} topLabel
 * @property {string} content
 * @property {boolean} contentMultiline
 * @property {string} bottomLabel
 * @property {?string} icon
 */

const icons = new Set([
  'AIRPLANE',
  'BOOKMARK',
  'BUS',
  'CAR',
  'CLOCK',
  'CONFIRMATION_NUMBER_ICON',
  'DOLLAR',
  'DESCRIPTION',
  'EMAIL',
  'EVENT_PERFORMER',
  'EVENT_SEAT',
  'FLIGHT_ARRIVAL',
  'FLIGHT_DEPARTURE',
  'HOTEL',
  'HOTEL_ROOM_TYPE',
  'INVITE',
  'MAP_PIN',
  'MEMBERSHIP',
  'MULTIPLE_PEOPLE',
  'OFFER',
  'PERSON',
  'PHONE',
  'RESTAURANT_ICON',
  'SHOPPING_CART',
  'STAR',
  'STORE',
  'TICKET',
  'TRAIN',
  'VIDEO_CAMERA',
  'VIDEO_PLAY'
]);

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

export function createKeyValueWidget({
  topLabel = '',
  content = '',
  contentMultiline = false,
  bottomLabel = '',
  icon = undefined
}) {
  if (!icon && !topLabel && !bottomLabel) {
    throw new Error(
      'At least one of `icon`, `topLabel` and `bottomLabel` must be defined'
    );
  }
  const widget = {
    keyValue: { topLabel, content, contentMultiline, bottomLabel }
  };
  if (icon) {
    if (!icons.has(icon)) {
      throw new Error(`Unknown icon ${icon}`);
    }
    widget.keyValue.icon = icon;
  }
  return widget;
}
