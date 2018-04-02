import React, { Component } from 'react';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import { Button, Grid } from 'material-ui';

import axios from 'axios';

export default class ReqCard extends Component {


    makeReq() {
        axios.get('http://jsonplaceholder.typicode.com/todos')
            .then( res => {
                console.log(res.data.slice(0, 10));
            })
            .catch( err => {
                console.log(err);
            })
    }

    makePost() {
        axios.post('http://jsonplaceholder.typicode.com/posts', {
            firstName: 'Fred',
            lastName: 'Flintstone',
            UID: 666
        })
            .then(function (res) {
                console.log(`Status: ${res.statusText} \nData: ${JSON.stringify(res.data)}`);
            })
            .catch(function (err) {
                console.log(err);
            });

    }

    render() {
        return(
            <Grid item xs >
                <Card>
                    <CardHeader 
                        title="HttpRequest"
                    />

                    <CardContent>
                    </CardContent>

                    <CardActions>
                        <Button
                            variant='raised'
                            size='medium'
                            color='primary'
                            onClick={() => this.makeReq()}
                        >
                            Make Request
                        </Button>

                        <Button
                            variant='raised'
                            size='medium'
                            color='primary'
                            onClick={() => this.makePost()}
                        >
                            Make Post
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    }
}