import { type Preview } from "@storybook/angular";
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);
import '!style-loader!css-loader!sass-loader!../src/styles.scss';


const preview: Preview = {
  decorators: [
    (Story: any, context: any) => {
      document.documentElement.setAttribute('data-theme', 'fyle');
      return Story(context);
    },
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
