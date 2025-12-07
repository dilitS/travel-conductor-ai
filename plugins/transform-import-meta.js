module.exports = function () {
  return {
    visitor: {
      MetaProperty(path) {
        if (path.node.meta.name === 'import' && path.node.property.name === 'meta') {
          // Replace import.meta with an empty object
          path.replaceWithSourceString('({})');
        }
      },
    },
  };
};

