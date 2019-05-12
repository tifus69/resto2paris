import React, { Component } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import SelectList from './SelectList';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
};

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  getFavorites = () => {
    console.log('hello');
    this.setState({ anchorEl: null });
    this.props.favorites();
  };

  render() {
    const { anchorEl, isAuthenticated } = this.state;
    const {
      classes,
      history,
      user,
      arrondissement,
      allRestaurants,
    } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar variant="dense">
            <IconButton
              // className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              style={{ fontSize: '20px' }}
              variant="title"
              color="inherit"
              className={classes.grow}
            >
              Restos de Paris
            </Typography>
            {user ? (
              <Typography
                style={{ fontSize: '15px' }}
                variant="title"
                color="inherit"
                // className={classes.grow}
              >
                {user.name}
              </Typography>
            ) : null}

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
              transitionDuration={1000}
            >
              <MenuItem
                onClick={e => {
                  this.setState({ anchorEl: null });
                  allRestaurants();
                  history.push('/');
                }}
              >
                Les restaurants
              </MenuItem>
              <MenuItem
                onClick={e => {
                  this.setState({ anchorEl: null });
                  history.push('/map');
                }}
              >
                Carte des restaurants
              </MenuItem>

              <MenuItem onClick={e => this.getFavorites()}>
                Mes Favoris
              </MenuItem>
              <MenuItem
                onClick={e => {
                  // this.props.favorites(54);
                  // this.setState({ anchorEl: null });
                  history.push('/signin');

                  // this.handleFavorites();
                }}
              >
                Login
              </MenuItem>
            </Menu>

            <SelectList arrondissement={arrondissement} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(NavBar));
