import _ from 'lodash';

const getNodeName = (node, path) => (path ? `${path}.${node.name}` : node.name);

const getValue = (value) => {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return !_.isObject(value) ? value : '[complex value]';
};

const formatPlain = (diff, depth = '') => {
  const result = diff
    .filter((node) => node.type !== 'unchanged')
    .map((node) => {
      switch (node.type) {
        case 'removed':
          return `Property '${getNodeName(node, depth)}' was removed`;
        case 'changed':
          return `Property '${getNodeName(node, depth)}' was updated. From ${getValue(node.value1)} to ${getValue(node.value2)}`;
        case 'added':
          return `Property '${getNodeName(node, depth)}' was added with value: ${getValue(node.value)}`;
        case 'nested':
          return formatPlain(node.children, getNodeName(node, depth));
        default:
          throw new Error('Unknown node status');
      }
    });
  return result.join('\n');
};

export default formatPlain;
