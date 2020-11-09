import MagicString from 'magic-string';

module.exports = {
  transforms: [
    {
      test({ path }) {
        return path.endsWith('.glsl')
      },
      transform({ id, code }) {
        const exportCode = `export default ${JSON.stringify(code)};`;
        const magicString = new MagicString(exportCode);

        return { 
          code: magicString.toString(),
          map: magicString.generateMap({
            source: id,
            includeContent: true
          })
        };
      }
    }
  ]
}