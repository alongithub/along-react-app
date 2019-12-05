module.exports = {
    root: true,
    settings: {
        "import/resolver": {
            alias: {
                map: [
                    ['@images', './src/images'],
                    ['@lib', './src/lib'],
                    ['@pages', './src/pages']
                ]
            }
        }
    },
    plugins: [
        'react',
    ],
    parser: 'babel-eslint',
    extends: 'airbnb',
    globals: {
        "document": true,
        "localStorage": true,
        "window": true
    },
    parserOptions: {
        "sourceType": "module",
        "ecmaVersion": 6,
    },
    rules: {
        'indent': ['error',
            4
        ],
        'max-len': ['error',
            150
        ],
        'react/jsx-indent': ['error',
            4
        ],
        'react/jsx-filename-extension': [
            'error',
            {
                'extensions': ['.js', '.jsx'
                ]
            }
        ],
        'react/jsx-indent-props': ['error',
            4
        ],
        'object-curly-spacing': ['off',
            "never"
        ],
        'no-console': 'off',
        'linebreak-style': 'off',
        'react/jsx-tag-spacing': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'import/no-unresolved': 1,
        'jsx-a11y/click-events-have-key-events': 0,
        'jsx-a11y/no-static-element-interactions': 0,
        'react/prop-types': 0,
        'jsx-a11y/no-noninteractive-element-interactions': 0,
        'no-restricted-syntax': 0,
        'guard-for-in': 0,
        'import/prefer-default-export': 0,
        'init-declarations': 2,
        'class-methods-use-this': 0,
        'eol-last': 0,
    }
}