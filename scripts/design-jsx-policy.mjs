import path from 'node:path';

// @shadcn/lint accepts non-color --* style values even with deny configured.
// Supplement only statically readable style keys; this is not runtime taint analysis.
const unwrap = node => {
  while (node && ['TSAsExpression','TSSatisfiesExpression','TSNonNullExpression','TypeCastExpression'].includes(node.type)) node = node.expression;
  return node;
};
function resolve(node, sourceCode, seen = new Set()) {
  node = unwrap(node);
  if (!node || node.type !== 'Identifier' || seen.has(node)) return node;
  seen.add(node);
  for (let scope = sourceCode.getScope(node); scope; scope = scope.upper) {
    const variable = scope.set.get(node.name);
    if (!variable) continue;
    const definition = variable.defs.find(def => def.type === 'Variable' && def.parent?.kind === 'const');
    if (definition?.node.init) return resolve(definition.node.init, sourceCode, seen);
    break;
  }
  return node;
}
const customPropertyOwners = [
  {file:'src/components/bottom-cta.tsx',properties:['--ds-bottom-cta-height'],reason:'Measured reservation in its core owner.'},
  {file:'src/components/content-primitives.tsx',properties:['--ds-grid-list-columns'],reason:'Validated GridList column count in its core owner.'},
  {file:'src/components/chart.tsx',properties:['--ds-chart-color'],reason:'Indicator uses the Chart config semantic series token; values remain subject to shadcn/no-inline-styles.'},
];
export { customPropertyOwners };
export default {
  rules: {
    'no-unowned-custom-properties': {
      meta: {
        type:'problem',
        docs:{description:'Prevent statically readable consumer style custom properties from bypassing DS appearance ownership.'},
        schema:[{type:'object',properties:{owners:{type:'array',items:{type:'object',properties:{file:{type:'string'},properties:{type:'array',items:{type:'string'}}},required:['file','properties'],additionalProperties:false}}},additionalProperties:false}],
        messages:{unowned:'Custom property {{property}} is not owned by this file. Use a public variant or its owning stylesheet; semantic values do not authorize a consumer token override.',computed:'Unresolved computed style key cannot establish custom-property ownership.'},
      },
      create(context) {
        const sourceCode = context.sourceCode;
        const file = path.relative(context.cwd,context.filename).split(path.sep).join('/');
        const owned = new Set((context.options[0]?.owners ?? []).filter(owner => owner.file === file).flatMap(owner => owner.properties));
        return {
          JSXAttribute(attribute) {
            if (attribute.name.name !== 'style' || attribute.value?.type !== 'JSXExpressionContainer') return;
            const seen = new Set();
            function inspect(expression) {
              const node = resolve(expression,sourceCode);
              if (!node || seen.has(node)) return;
              seen.add(node);
              if (node.type === 'ConditionalExpression') { inspect(node.consequent); inspect(node.alternate); return; }
              if (node.type === 'LogicalExpression') { inspect(node.left); inspect(node.right); return; }
              if (node.type !== 'ObjectExpression') return;
              for (const property of node.properties) {
                if (property.type === 'SpreadElement') { inspect(property.argument); continue; }
                const key = property.computed ? resolve(property.key,sourceCode) : property.key;
                const name = key?.type === 'Literal' ? key.value : !property.computed && key?.type === 'Identifier' ? key.name : undefined;
                if (name === undefined && property.computed) context.report({node:property,messageId:'computed'});
                else if (typeof name === 'string' && name.startsWith('--') && !owned.has(name)) context.report({node:property,messageId:'unowned',data:{property:name}});
              }
            }
            inspect(attribute.value.expression);
          },
        };
      },
    },
  },
};
