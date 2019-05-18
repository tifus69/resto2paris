import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import CardList from './CardList';
import MapList from './MapList';
import NavBar from './NavBar';
import SignIn from './SignIn';
import SignUp from './SignUp';
// import * as init from './InitDb';

const styles = () => ({
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      restaurantsFiltered: [],
      loading: true,
      favorites: [],
      user: null,
      isAuthenticated: false,
    };
  }

  componentDidMount() {
    // init.InitDb();
    this.getAllRestaurants();
  }

  notify = (type, text) => {
    toast(text, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: true,
      type,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
    });
  };

  getAllRestaurants = () =>
    axios
      .get('/api/restaurants')
      .then(res => {
        return this.setState({
          restaurants: res.data,
          restaurantsFiltered: res.data,
          loading: false,
          favorites: [],
        });
      })
      .catch(error => this.notify('error', error.flash));

  getFavorites = () => {
    const { isAuthenticated, user, restaurants } = this.state;
    const favorites = [];
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      const { id } = user;
      axios
        .post(
          `/api/getFavorites/${id}`,
          {},
          {
            headers: { Authorization: `bearer ${token}` },
          }
        )
        .then(res => {
          restaurants.forEach(restaurant => {
            res.data.map(favoris =>
              favoris.restaurant_id === restaurant.id
                ? favorites.push(restaurant)
                : null
            );
          });
          return this.setState({ favorites });
        })
        .catch(error => this.notify('error', error.flash));
    }
  };

  handleAuthenticated = (user, isAuthenticated) =>
    this.setState({
      user,
      isAuthenticated,
    });

  filter = arrondissement => {
    const { restaurants, favorites } = this.state;
    const filtered = (favorites.length ? favorites : restaurants).filter(
      elt => elt.address2 === arrondissement
    );

    if (arrondissement === 'tous')
      return this.setState({
        restaurantsFiltered: favorites.length ? favorites : restaurants,
      });
    return this.setState({
      restaurantsFiltered: filtered,
    });
  };

  showFavorites = () => {
    const { favorites } = this.state;
    this.getFavorites();
    this.setState({ restaurantsFiltered: favorites });
  };

  addFavoriteList = restaurant => {
    const { favorites } = this.state;
    favorites.push(restaurant);
    this.setState({ favorites });
  };

  signOut = () => {
    const { history } = this.props;
    axios
      .get('/auth/signout')
      .then(res => res.data)
      .then(res => this.setState({ user: res.user, isAuthenticated: false }))
      .then(() => localStorage.removeItem('token'))
      .then(() => this.getAllRestaurants())
      .then(() => this.notify('success', 'Au revoir !'))
      .then(() => history.push('/'));
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      restaurantsFiltered,
      user,
      isAuthenticated,
      favorites,
    } = this.state;
    return (
      <div>
        <ToastContainer />
        <NavBar
          arrondissement={this.filter}
          favorites={this.showFavorites}
          allRestaurants={this.getAllRestaurants}
          user={user}
          isAuthenticated={isAuthenticated}
          signout={this.signOut}
        />
        <div className="mt-5">
          {loading ? (
            <div className={classes.spinner}>
              <CircularProgress size={100} thickness={5} />
            </div>
          ) : (
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <CardList
                    restaurants={restaurantsFiltered}
                    {...props}
                    user={user}
                    isAuthenticated={isAuthenticated}
                    favResto={favorites}
                    addFavoriteList={this.addFavoriteList}
                  />
                )}
              />
              <Route
                path="/signin"
                render={() => (
                  <SignIn
                    handleAuthenticated={this.handleAuthenticated}
                    favorites={this.getFavorites}
                  />
                )}
              />
              <Route path="/signup" render={() => <SignUp />} />

              <Route
                path="/map"
                render={props => (
                  <MapList restaurants={restaurantsFiltered} {...props} />
                )}
              />
            </Switch>
          )}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(App));
