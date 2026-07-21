import cssjanus from 'cssjanus';
import {
  COMMENT,
  compile,
  DECLARATION,
  IMPORT,
  KEYFRAMES,
  MEDIA,
  RULESET,
  serialize,
  strlen,
  SUPPORTS,
} from 'stylis';

function stringifyPreserveComments(element, index, children) {
  switch (element.type) {
    case IMPORT:
    case DECLARATION:
    case COMMENT:
      return (element.return = element.return || element.value);
    case RULESET: {
      element.value = Array.isArray(element.props) ? element.props.join(',') : element.props;
      if (Array.isArray(element.children)) {
        element.children.forEach((child) => {
          if (child.type === COMMENT) {
            child.children = child.value;
          }
        });
      }
      break;
    }
    default:
      break;
  }

  const serializedChildren = serialize(Array.prototype.concat(element.children), stringifyPreserveComments);
  return strlen(serializedChildren) ? (element.return = `${element.value}{${serializedChildren}}`) : '';
}

function stylisRTLPlugin(element, index, children, callback) {
  if (
    element.type === KEYFRAMES ||
    element.type === SUPPORTS ||
    (element.type === RULESET && (!element.parent || element.parent.type === MEDIA || element.parent.type === RULESET))
  ) {
    const stringified = cssjanus.transform(stringifyPreserveComments(element, index, children));
    element.children = stringified ? compile(stringified)[0].children : [];
    element.return = '';
  }
}

Object.defineProperty(stylisRTLPlugin, 'name', { value: 'stylisRTLPlugin' });

export default stylisRTLPlugin;