/**
 * Helper function to create a pipe detection rule.
 * @param {RegExp} regex - Regular expression to match the pipe pattern
 * @param {string} messageId - The message ID to report
 */
function createPipeRule(regex, messageId) {
  return function(context) {
    return {
      Program() {
        const sourceCode = context.getSourceCode();
        const text = sourceCode.text;
        let match;

        // eslint-disable-next-line no-cond-assign
        while ((match = regex.exec(text)) !== null) {
          const fullMatch = match[0];
          const startIndex = match.index;
          const endIndex = startIndex + fullMatch.length;

          const startLoc = sourceCode.getLocFromIndex(startIndex);
          const endLoc = sourceCode.getLocFromIndex(endIndex);

          context.report({
            loc: {
              start: startLoc,
              end: endLoc,
            },
            messageId: messageId,
          });
        }
      },
    };
  };
}

module.exports = {
  /**
   * Template rule: disallow the built-in Angular date pipe usage in templates.
   *
   * Flags the entire pipe expression in patterns like:
   *   {{ someDate | date }}
   *   {{ someDate | date:'MMM dd, yyyy' }}
   *
   * and encourages using a centralized date format approach or variable-based formatting
   * to support org-level date format preferences.
   */
  'no-angular-date-pipe': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow Angular date pipe usage in templates; use the orgDate pipe instead to support org-level formatting preferences',
        recommended: false,
      },
      schema: [],
      messages: {
        noAngularDateFormatTemplate:
          'Avoid using Angular date pipes in templates. Use the orgDate pipe instead to support org-level date format preferences.',
      },
    },
    /**
     * Flags patterns like:
     *   | date
     *   | date:'MMM dd, yyyy'
     *   |date : 'h:mm a'
     */
    create: createPipeRule(/\|\s*date\b[^}|]*/g, 'noAngularDateFormatTemplate'),
  },

  /**
   * Template rule: disallow the built-in Angular currency pipe usage in templates.
   *
   * Flags the entire pipe expression in patterns like:
   *   {{ amount | currency }}
   *   {{ amount | currency:'USD' }}
   *   {{ amount | currency:'EUR':'symbol' }}
   *
   * and encourages using a centralized currency format approach or variable-based formatting
   * to support org-level currency format preferences.
   */
  'no-angular-currency-pipe': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow Angular currency pipe usage in templates; use the orgCurrency pipe instead to support org-level formatting preferences',
        recommended: false,
      },
      schema: [],
      messages: {
        noAngularCurrencyFormatTemplate:
          'Avoid using Angular currency pipes in templates. Use the orgCurrency pipe instead to support org-level currency format preferences.',
      },
    },
    /**
     * Flags patterns like:
     *   | currency
     *   | currency:'USD'
     *   | currency : 'EUR' : 'symbol'
     */
    create: createPipeRule(/\|\s*currency\b[^}|]*/g, 'noAngularCurrencyFormatTemplate'),
  },
};
