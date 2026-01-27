module.exports = {
  /**
   * Template rule: disallow the built-in Angular date pipe usage in templates.
   *
   * Flags the entire pipe expression in patterns like:
   *   {{ someDate | date }}
   *   {{ someDate | date:'MMM dd, yyyy' }}
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
    create(context) {
      return {
        Program() {
          const sourceCode = context.getSourceCode();
          const text = sourceCode.text;

          /**
           * Rough pattern:
           *   | date
           *   | date:'MMM dd, yyyy'
           *   |date : 'h:mm a'
           *
           * We flag the entire pipe expression starting from |.
           */
          const regex = /\|\s*date\s*(:\s*('([^']*)')?)?/g;
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
              messageId: 'noAngularDateFormatTemplate',
            });
          }
        },
      };
    },
  },
};
