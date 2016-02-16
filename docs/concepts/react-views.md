## React views

Rook is built around React, and most of the plumbing exists to support it. Therefore, Rook provides very few opinions on structuring your React application. We do however set up a basic skeleton.

### The `_app` directory

There are two files of note here: `App.js` and `Head.js`.

`App.js` handles your core application shell. You may choose to include a navbar and footer here. Additionally, you'll provide the defaults for [react-document-meta](https://github.com/kodyl/react-document-meta) in this file.

`Head.js` is used for extensions to the `<head>` element on your app. Likely candidates for inclusion here include CDN loaded third-party CSS libraries.

### The `routes.js` file

This file is the core of [react-router](https://github.com/reactjs/react-router). You'll define your routes and special handlers for them here.

### Integration with Redux

As we've learned, Redux controls your application state. You'll need to view this state and dispatch actions to modify the state from your React view. [Home.js](https://github.com/apazzolini/rook-starter/blob/master/src%2Fviews%2Fhome%2FHome.js) covers both of these cases. First, let's see how we extract values from Redux.

```js
const mapStateToProps = (state) => ({
  random: state.random.toJS()
});

export class Home extends Component {
  static propTypes = {
    random: PropTypes.shape({
      number: PropTypes.number,
      time: PropTypes.date
    })
  };
}

export default connect(mapStateToProps)(Home);
```

There are a few things happening here:

- We extract a specific component from the Redux state: `random`
  - Also note that we're calling the Immutable.js `toJS()` function to make it easier to deal with the objects in this state. If you're dealing with a performance-critical application, you may choose to use the Immutable.js getters instead.
- We specify the properties we use from the state in `propTypes`
- We connect our specific Redux state to the Home component
- We export both the connected component (for App usage) and the non-connected component (for testing)

Next, we might need to dispatch actions to modify the state:

```js
import * as Random from '../../redux/modules/random';

export class Home extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };

  loadNewRandom = (e) => {
    e.preventDefault();
    this.props.dispatch(Random.actions.loadNewRandom());
  };

  render() {
    return (
      <a href="#" onClick={this.loadNewRandom}>Load new random number</a>
    )
  }
}
```

This is a common pattern for interacting with Redux. We create a new action from our `Random.actions.loadNewRandom()` action creator and dispatch it to the Redux store.

### Inline-styles

At the time I was creating Rook, none of the JS-based inline-styles libraries were mature enough. Support for this might be added in the future, but the current state is a simple PostCSS and PreCSS shell. Rook will handle a couple of things for you:

- Hot reloading styles in development
- Minifying / vendor prefixing / bundling in production

### Testing

Our React tier is the third piece of the testing support built into Rook. [Home.test.js](https://github.com/apazzolini/rook-starter/blob/master/src%2Fviews%2Fhome%2F__tests__%2FHome.test.js) in the rook-starter project is an example of how to use shallow rendering to test a component.

## Next Steps

We're almost done! The very important [data fetching](data-fetching.md) section is up next.