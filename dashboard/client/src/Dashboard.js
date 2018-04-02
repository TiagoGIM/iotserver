import React, { Component } from 'react';
import {Button, Menu, MenuItem, Grid } from 'material-ui';
import AddIcon from 'material-ui-icons/Add';
import { KeyboardCard, ChatCard, GraphCard } from './components/cards';

import { open_room, getPins } from './api'

class Fab extends Component {
    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    clickedOption = card => {
        this.props.callback(card);
        this.handleClose();        
    };

    render() {
        const { anchorEl } = this.state;
        return(
            <div>
                <Button
                    variant='fab'
                    size="medium" 
                    color="primary"
                    onClick={this.handleClick}
                    style={{margin: 0, top: 'auto', left: 'auto', bottom: 30, right: 30, position:'fixed'}}
                >
                    <AddIcon />
                </Button>

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    style={{margin: 0, top: 'auto', left: 'auto', bottom: 50, right: 50, position: 'fixed'}}
                >
                    <MenuItem onClick={() => this.clickedOption('chat')}>Chat Card</MenuItem>
                    <MenuItem onClick={() => this.clickedOption('keyboard')}>Keyboard Card</MenuItem>
                    <MenuItem onClick={() => this.clickedOption('graph')}>Graph Card</MenuItem>
                </Menu>
            </div>
        );
    }
}

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chat: true,
            keyboard: true, 
            graph: false
        };
    }

    hideCallback = card => {
        let update = this.state;
        update[card] = !update[card];
        
        this.setState({ ...update });
    }

    addCard = card => {
        let update = this.state;
        
        if(!update[card]){
            update[card] = true;        
            this.setState({ ...update });
        }else {
            alert('O card já existe!');
        }
        
    }

    componentWillMount() {
        open_room('Sala do Richard');
        getPins();
    }

    render() {
        return(
            <Grid container spacing={24}>
        
                <ChatCard show={this.state.chat} callback={this.hideCallback}/>

                <KeyboardCard show={this.state.keyboard} callback={this.hideCallback} />
                
                <GraphCard show={this.state.graph} callback={this.hideCallback} />
            
                <Fab callback={this.addCard}/>
            </Grid>
        );
    }
}