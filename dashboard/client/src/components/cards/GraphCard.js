import React, { Component } from 'react';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import { Button, IconButton, Typography, Grid } from 'material-ui';

import { VisibilityOff } from 'material-ui-icons';

export default class GraphCard extends Component {
    state = {
        show: this.props.view
    };

    handleHide = card => {
        let update = !this.state.show;
        this.setState({ show: update }); 
        this.props.callback(card);
    };

    componentWillReceiveProps(update) {  
        let show = update.show;             
        this.setState({ show });      
    }

    render() {
        if(!this.state.show){
            return null;
        }
        return(
            <Grid item xs>
                <Card>
                    <CardHeader 
                        title="Gráfico" 
                        action={
                            <IconButton>
                               <VisibilityOff  onClick={() => this.handleHide('graph')} />
                            </IconButton>
                        }
                    />

                    <CardContent>
                        <Typography component="p">
                            Placeholder
                        </Typography>
                    </CardContent>
                    
                    <CardActions>
                        <Button variant='raised' size="medium" color="primary">
                            Action
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    }
}
