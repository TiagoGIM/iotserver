import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from 'material-ui';

import MenuIcon from 'material-ui-icons/Menu';

export default props => 
    <AppBar position="static">
        <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
                <MenuIcon />
            </IconButton>

            <Typography variant="title" color="inherit">
                Title
            </Typography>

            <Button color="inherit">Login</Button>
        </Toolbar>
    </AppBar>