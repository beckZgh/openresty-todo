module.exports = {
    root   : true,
    extends: ['@sumdoo/eslint-config'],
    globals: {
        Taro      : 'readonly',
        luckysheet: 'readonly',
    },
    overrides: [
        {
            files: ['./packages/sumdoo/cli/**/*.ts'],
            rules: {
                'no-console'                        : 'off',
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
    rules: {
        /**
         * 强制导入在首位, 与 vue 多个 script 标签冲突
         * https://github.com/import-js/eslint-plugin-import/blob/v2.26.0/docs/rules/first.md
         */
        'import/first': 'off',

        'no-new'      : 'off',
        'dot-notation': 'off',

        'new-cap': 'off',

        /**
         * 关闭数组括号间距检查
         * https://eslint.org/docs/latest/rules/array-bracket-spacing
         */
        'array-bracket-spacing': 'off',

        /**
         * 强制 define 编译宏
         * https://eslint.vuejs.org/rules/define-macros-order.html
         */
        'vue/define-macros-order': 'off',

        /**
         * 强制禁用不允许使用 v-html v-text
         * https://eslint.vuejs.org/rules/no-v-text-v-html-on-component.html
         */
        'vue/no-v-text-v-html-on-component': 'off',

        /**
         * 不允许export进入<script setup>
         * https://eslint.vuejs.org/rules/no-export-in-script-setup.html
         */
        'vue/no-export-in-script-setup': 'off',

        /**
         * tsx 强制显示声明组件名称
         * https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md
         */
        'react/display-name': 'off',

        /**
         * 强制编写 prop 验证函数
         * https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md
         */
        'react/prop-types': 'off',

        'react/jsx-key': 'off',

        '@typescript-eslint/quotes': 'off',

        'no-trailing-spaces'     : 'off',
        'no-multiple-empty-lines': 'off',
    },
}
