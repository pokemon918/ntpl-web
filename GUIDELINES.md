# Frontend Development Guidelines

## Sharing Local State for Debugging Purposes

Testers may hand you state files in JSON format. These files contain the state of the application when an issue happened. Developers can also export these files.

The purpose of these files is attempting to reproduce the same faulty state in a development environment so that we have better odds to identify and fix an issue that is generally difficult to reproduce.

Check out the dedicated documentation of [LOCAL STATE](tools/LOCAL STATE.md) for details.

## Structure

The frontend repository is split between a few key folders:

- `src/`: all source code
    - `actions/`: redux actions
    - `assets/`: global styles and json configuration files; do not place images here
    - `commons/`: common functions used globally
    - `components/`: components organised by route-folders, place route specific images here, place no styles here
        - `shared/`: components shared by any routes, place shared images here along with its respective component
            - `ui/`: all components that define the user interface must be placed here, along with required styles, images, and unit/integration tests; create a new folder for each new ui component and put all its related files in that folder
    - `config/`: files that define the app configuration
    - `constants/`: constants, including redux action types
    - `ntbl_client`: business logic of NTBL for requesting data from the API, signing requests, and the rating algorithm
    - `reducers/`: redux reducers
- `stories/`: stories for Storybook, it should contain only stories of UI components
- `test/`: end-to-end tests

## New Design

We are in process of implementing the new design. In the present time, no part of the app should be updated to the new design. We should always create dumb UI components in the respective `ui` folder, write unit and/or integration tests, and write stories for Storybook to demonstrate how that component looks like.

The time to put the new design into the app will come in the short future, and only after that we should start putting the UI components into the app.

Please note that everything that requires styling is considered part of the user interface and must be placed in the `ui` folder as dumb components, and not directly in any route component. You'll find most of the current app files have stylesheets everywhere, but we're changing this pattern gradually with the migration to the new design, and we should avoid at all costs to put styles in the routes. This practice makes the design and the routes decoupled which makes maintenance of both sides easier and more reliable.

## Creating UI Components

Most UI components will be created from design mockups posted on Trello. The tasks on Trello generally include details about margin, padding, fonts, colours, and anything else necessary.

Eventually, while working in a feature task, we may need to create new UI elements which. The rule of thumb is that whenever you have to create styles, ask yourself if it makes sense to make that a dumb component. If yes, place it along with the UI components.

UI components must be created in the `src/components/shared/ui/` folder. Start by creating a new folder for the new UI component. Inside the new folder, you should have the following files:

`src/components/shared/ui/MyDumbComponent/`:

- `index.js`: the UI component entry point
- `image1.png`, `image2.svg`: any images required by this component
- `MyDumbComponent.scss`: any styles used by this component
- `MyDumbComponent.spec.js`: unit and/or integration tests for this component

If that component is too big, it may make sense to break it into one or more smaller parts, which would look like:

`src/components/shared/ui/MyDumbComponent/`:

- `SmallerPart.js`: UI component for the smaller part
- `SmallerPart.scss`: any styles used by this smaller part
- `SmallerPart.spec.js` unit and/or integration tests for this smaller UI component

### Components Styling

The stylesheets of UI components should not contain any hard coded colours. Instead, add the colours to the theme stylesheet that is found on `src/components/shared/ui/_theme.scss`, and import this stylesheet into yours.

Prefix the class names in a way that avoids naming conflicts with other UI components or anything else in the app. For example, in a component called `TastingTypeCard`, you should prefix all class names with `TastingTypeCard__`, such as:

```scss
.TastingTypeCard__Container {
	//
}

.TastingTypeCard__Footer {
	//
}

.TastingTypeCard__ThemeContrast .TastingTypeCard__Footer {
	//
}
```

### Images

Images that are exclusive of a UI component should be placed in the same folder of the component.

If the image is SVG, render it with a SVG tag instead of using an IMG tag. It can be achieved with:

```jsx
import { ReactComponent as MyImage } from './someImage.svg';

render() {
  return (
    <div>
      <MyImage />
    </div>
  )
}
```

### Writing Stories

We use Storybook to write stories that document how our UI components are used. To get started, open a terminal in the repository folder and execute the command `yarn storybook`. Storybook will load and a new page will automatically open in your web browser with the Storybook page containing all our stories.

These stories are defined in the `stories` folder in the repository, more specifically in the `stories/index.stories.js` file. Read the [official Storybook documentation here](https://storybook.js.org/docs/basics/writing-stories/) to learn how to write stories.

Please help maintaining the stories sorted alphabetically by the component name. This makes it easier to find a given component by scanning the list.

### Testing UI Components

Write at least two or three unit tests to reduce the risk of losing functionality of UI components over time. Don't abuse of snapshot tests, but prefer to assert manually for everything that's expected and not expected.

The first test is generally a check if the component renders without crashing. Then you would write other tests to assert things like:

- if the expected text is displayed when given props are passed
- if a list of items is displayed when the given list prop is filled
- if a list of items is NOT displayed when the given list prop is NOT filled
- if a callback function is fired when a button is clicked
- any other relevant user interaction should be tested!

## Writing Tests

Our current test stack is:

- Unit and Integration tests: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/); responsibility of the Frontend Development team
- E2E tests: under research and experiments, will be defined soon; responsibility of the Quality Assurance team

Please read these articles to get an overview of what and how to test:

- https://kentcdodds.com/blog/how-to-know-what-to-test
- https://kentcdodds.com/blog/write-tests
- https://www.youtube.com/watch?v=gJMYMnyA7ZE

### Main Principle

> The more your tests resemble the way your software is used, the more confidence they can give you.

@kentcdodds at [twitter](https://twitter.com/kentcdodds/status/977018512689455106)

For example, consider a form component. Traditionally, lots of people do something like:

```

const usernameInput = wrapper.find('input').first()
const passwordInput = wrapper.find('input').last()

```

We should not do that! Instead, it's better to do:

```

const usernameInput = getByLabelText('Username')
const passwordInput = getByLabelText('Password')

```

Because users look for your fields by their label text, not by the fact that one comes first and the other comes second. If you're not familiar with `getByLabelText` and similar functions, please read the react-testing-library documentation at https://testing-library.com/ before writing any tests. It's really helpful!

Source: tweets from @kentcdodds [here](https://twitter.com/kentcdodds/status/981648459685122048) and [here](https://twitter.com/kentcdodds/status/981648654631976960), see more examples at [this video](https://www.youtube.com/watch?v=gJMYMnyA7ZE)

### Unit Tests

Unit tests are used to test small components or functions without interaction with anything else. Because of covering a small portion of code with no interaction, these are the easiest type of test to write. They generally provide the least value as well, because testing simple stuff that don't change often shouldn't be a big concern.

However, we **must** write unit tests for any function that involves business logic. Be it a simple or a complex function, we don't want issues in any business logic, so, every bit of them should be covered with tests. In this case, testing for business scenarios is more efficient than simply writing tests that target getting test coverage. We may need help from the product owner in this case. Don't hesitate to ask for his help when writing tests for business logic!

We should also write unit tests for UI components or route components, but in this case, having full test coverage shouldn't be a concern. Instead, let's focus on the tests that provides most value, that is, let's focus on how the actual user interaction looks like and test that.

See some examples at [src/reducers/winesReducer.spec.js](src/reducers/winesReducer.spec.js) and [src/components/shared/CheckBox.spec.js](src/components/shared/CheckBox.spec.js).

### Integration Tests

Integration tests are used to test how components interact with each other. UI components or route components will often have unit tests and integration tests. There's no need to separate them in the file, it's just important to cover the necessary cases and relevant edge cases.

Examples of integration tests are a route component that renders a list of items or a modal with a form. The latter can usually have two levels of integration: Route Component > Modal > Form. We should test integration only with the lower intermediary level, for example, if testing the Route Component, only test integration with the Modal component, and if testing the Modal component, only test integration with the Form component. The Route Component should never test integration with the Form component, because it's a concern of the Modal component that it shouldn't care to. We should keep separation of concerns in mind when writing integration tests. We don't want to rewrite tests of components that weren't modified.

Also, it's generally better to mock the components we are testing for integration, so that we isolate their concerns completely, avoiding unnecessary refactors or rewrites on tests. We don't want our integration tests to break if a children component changes the way it renders something. We only want to make sure the children components receives the expected props, and that calling functions passed to their props do the expected action in the parent component.

See some examples at [src/components/events/MyEvents.spec.js](src/components/events/MyEvents.spec.js).

## Modals

We've got a modal component at `components/shared/ui/Modal` that is used in the **New Tasting** screens.

While this modal has a `title` prop to set its title in the header, it's also possible to set the title from a component at the very bottom using the Modal Context. This can be very convenient for updating the title inside the tasting steps.

The modal also has a subtitle and breadcrumb, but both can only be set through the Modal Context.

To use the Modal Context, start by importing the Modal component in any component that will be rendered inside a modal. It can be a rating step or any smaller component used by a rating step, for example.

```
import Modal from 'components/shared/ui/Modal';
```

Then you can simply add one or more of the following components in your render method:

### Modal.Title

Sets the title of the modal. Overrides the `title` prop that may have been passed to the modal. The text is always translated, so, make sure to use an i18n key and not an actual text.

```
<Modal.Title text="my_title_i18n_key" />
```

### Modal.SubTitle

Sets the subtitle of the modal. The text is always translated, so, make sure to use an i18n key and not an actual text.

```
<Modal.SubTitle text="my_subtitle_i18n_key" />
```

### Modal.Breadcrumb

```
<Modal.Breadcrumb path="root_i18n_key / child_i18n_key / grandchild_i18n_key" />
```

The `/` character is used for splitting and rendered as a chevron in the actual breadcrumb. The split strings are also always translated and the last one is always bold.

## Ideas and Feedback

Any ideas and feedback are greatly appreciated. Just write it somewhere on Trello and ping the team, and let's discuss it! :)

## How To Start

[Environments requirements and How To Start tutorial](onboard.md)

### How to add new cypress test:

1. use `yarn e2e` or `yarn test-e2e` command to run tests. If we run `yarn e2e`, Electron browser will be opened and we will be able to use selectorPlayground for debug purpose.
2. dev shoud create file in integrtions folder `test/e2e/cypress/integration`
3. User authorization/registration credentials are stored in `project_root\test\e2e\cypress\cypress.json` file. Use `Cypress.env('userEmail')`,  `Cypress.env('userPassword')` to get them in code.
4. to visit some page use cy.visit('/your_page_root');
5. to get exact DOM element add data-test attribute to it and access this elementi via attribute ie: `cy.get([data-test=btnNext]);`
6. We have multilingual app so that please do not use `contains()` method. Please use  `get()` method with appropriate data-test DOM attribute as a parameter

#### Guidelines

Always use data attributes like `cy.get([data-test=btnNext]);` to get elements. Never rely on class names on positional queries because they will change from time to time and it would break your tests. If a component you need to test doesn't have a data attribute, please add it first.

#### Drag and Drop

Some e2e tests may need to drag and drop. This can be achieve by using the `trigger` method to fire mousedown, mousemove and mouseup events. There's a recipe at https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__drag-drop/cypress/integration/drag_n_drop_spec.js#L22-L27.

#### Recording e2e tests

Writing e2e tests from scratch can be very time consuming because you have to dive into the structure of the components to extract the names and values of the data attributes.

To make it easier to produce e2e tests, you can use the Cypress Recorder extension. This extension allows you to press a record button, use the app and have your actions recorded, press a stop button, and the e2e test code is generated for you! Although, please make sure to read the generated code, run it, and make sure that it makes sense. Known limitations are not recording drag and drop actions and slider values, to which you must write the code yourself.

The extension can be found in the Chrome store - however, it has an issue with data attributes and therefore is not compliant with our guidelines mentioned above. There's an [ongoing pull request](https://github.com/oscartavarez/cypress-recorder/pull/3) that will fix this soon. Meanwhile, please use our forked version of the Cypress Recorder extension.

The forked extension is available at https://github.com/fmoliveira/cypress-recorder, and the binaries can be [downloaded here](https://github.com/fmoliveira/cypress-recorder/releases/download/v1.0/ntbl-cypress-recorder.zip). If you've downloaded this extension from the Chrome store, make sure to uninstall it and keep only our forked version. Extract the attached file, go to Chrome extensions tab, click on "Load unpacked", and select the folder where you extracted the forked extension.

After installing the extension, click on its Gear icon to go to the **Cypress Recorder Options** screen and set the field **Custom Data Attribute** to `data-test`. Close the options screen and be happy recording e2e tests.