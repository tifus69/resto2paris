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
    '&:focus': {
      outline: 'none !important',
    },
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

  render() {
    const { anchorEl } = this.state;
    const {
      classes,
      history,
      user,
      arrondissement,
      allRestaurants,
      isAuthenticated,
      signout,
      restaurants,
    } = this.props;

    return (
      // <div className={classes.root}>
      <AppBar
        position="fixed"
        classes={{
          root: classes.grow,
        }}
      >
        <Toolbar variant="dense">
          <IconButton
            classes={{
              root: classes.root,
            }}
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
            variant="h6"
            color="inherit"
            className={classes.grow}
          >
            Restos de Paris
          </Typography>
          {user ? (
            <Typography
              style={{ fontSize: '15px' }}
              variant="h6"
              color="inherit"
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
              onClick={() => {
                this.setState({ anchorEl: null });
                allRestaurants();
                history.push('/');
              }}
            >
              Les restaurants
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.setState({ anchorEl: null });
                history.push('/map');
              }}
            >
              Carte des restaurants
            </MenuItem>
            {isAuthenticated ? (
              <div>
                <MenuItem
                  onClick={() => {
                    this.setState({ anchorEl: null });
                    history.push('/favorites');
                  }}
                >
                  Mes Favoris
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.setState({ anchorEl: null });
                    signout();
                  }}
                >
                  Logout
                </MenuItem>
              </div>
            ) : (
              <MenuItem
                onClick={() => {
                  this.setState({ anchorEl: null });
                  history.push('/signin');
                }}
              >
                Login
              </MenuItem>
            )}
          </Menu>

          <SelectList
            arrondissement={arrondissement}
            restaurants={restaurants}
          />
        </Toolbar>
      </AppBar>
      // </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(NavBar));
