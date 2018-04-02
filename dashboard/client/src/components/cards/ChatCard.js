import React, { Component } from 'react';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import { Button, IconButton, TextField, Grid, Typography } from 'material-ui';

import { ChatFeed, Message } from 'react-chat-ui';

import { VisibilityOff, Send, ExpandMore } from 'material-ui-icons';

import { sendMsg } from '../../api'

export default class ChatCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.view,
            msg: '',
            log: [
                new Message({ id: 1, message: "Thing messages", senderName: 'Thing' }), 
                new Message({ id: 0, message: "Your messages" })
            ]
        }
    }

    handleMsg = name => event => {
        this.setState({ [name]: event.target.value });      
    };

    handleSend = () => {
        let msg = this.state.msg;
        if(msg.length > 0){
            //Evia ao socket
            sendMsg(msg);

            //Deixa a mensagem salva no log 
            let log = this.state.log.slice();
            log.push(
                new Message({
                    id: 0,
                    message: msg,
                    senderName: 'You'
                })
            );
            this.setState({ log })

            this.setState({ msg: '' });
        }
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
                        title="Chat" 
                        action={
                            <IconButton>
                                <VisibilityOff onClick={() => this.handleHide('chat')} />
                            </IconButton>
                        }
                    /> 

                    <CardContent>
                        <form>
                            <TextField
                                id="msg"
                                label="Insira uma mensagem"
                                value={this.state.msg}
                                onChange={this.handleMsg('msg')}
                            />
                            <Button onClick={this.handleSend} variant="raised" size="small" color="secondary" style={{marginLeft: 10}}>
                                Send
                                <Send/>
                            </Button>
                        </form>
                    </CardContent>

                    <CardContent>
                        <ExpansionPanel>

                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                <Typography>Chat log</Typography>
                            </ExpansionPanelSummary>

                            <ExpansionPanelDetails>
                                <ChatFeed
                                    messages={this.state.log} // Boolean: list of message objects
                                    hasInputField={false} // Boolean: use our input, or use your own
                                    showSenderName // show the name of the user who sent the message
                                />
                            </ExpansionPanelDetails>

                        </ExpansionPanel>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}