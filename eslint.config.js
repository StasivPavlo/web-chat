import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
        "max-len": ["error", {
            "code": 120,
            "comments": 120,
            "ignoreTemplateLiterals": true,
        }],
        "semi": ["error", "always"],
        "semi-style": ["error", "last"],
        "space-before-function-paren": 0,
        "no-var": "error",
        "prefer-const": "error",
        "comma-dangle": ["error", "always-multiline"],
        "curly": ["error", "all"],
        "no-redeclare": ["error", { "builtinGlobals": true }],
        "no-param-reassign": "error",
        "operator-linebreak": 0,
        "no-console": "error",
        "standard/no-callback-literal": 0,
        "import/prefer-default-export": 0,
        "padding-line-between-statements": [
            "error",
            { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
            { blankLine: "always", prev: "*", next: ["return", "block-like", "multiline-expression"]},
            { blankLine: "always", prev: "*", next: ["const", "let", "var"]},
            { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]},
        ],
        "brace-style": ["error", "1tbs"],
        "object-curly-newline": [2, {
            "ObjectExpression": {
                "consistent": true,
                "minProperties": 4,
            },
        }],
        "no-prototype-builtins": 0,
        'function-paren-newline': ['error', 'consistent'],
        indent: ['error', 2, {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            // MemberExpression: null,
            FunctionDeclaration: {
                parameters: 1,
                body: 1
            },
            FunctionExpression: {
                parameters: 1,
                body: 1
            },
            CallExpression: {
                arguments: 1
            },
            ArrayExpression: 1,
            ObjectExpression: 1,
            ImportDeclaration: 1,
            flatTernaryExpressions: false,
            // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
            ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
            ignoreComments: false
        }],
        'no-unused-expressions': ['error', {
            allowShortCircuit: false,
            allowTernary: false,
            allowTaggedTemplates: false,
        }],
    },
    ignores: ["src/components/ui/**"],
  },
)
