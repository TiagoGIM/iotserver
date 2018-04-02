import React, { Component } from 'react';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import { Button, IconButton, Switch, FormControlLabel, FormControl, FormGroup, InputLabel, Select, Input, Dialog, DialogTitle, DialogContent, MenuItem, DialogActions, Grid } from 'material-ui';

import { VisibilityOff } from 'material-ui-icons';

import { saveKeyboard } from '../../api';

const styles = ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: 15,
        minWidth: 120,
        padding: 5
    }
});

class AddBtn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            a_pins: [1, 2, 3],
            btn_pin: '',
            btn_name: '',
            btn_state: false
        };
        
    }    

    handleChange = name => event => {    
        this.setState({ [name]: event.target.value });
    };

    handleState = name => event => {        
        this.setState({ [name]: event.target.checked });
    };

    handleClickOpen = () => {
      this.setState({ open: true });
    };
  
    handleClose = () => {
        this.setState({ open: false });
    };

    createBtn = () => {

        this.props.callback({
            name: this.state.btn_name,
            pin: this.state.btn_pin,
            state: this.state.btn_state
        });
        
        // Remove o pino do butão criado dos pinos disponiveis 
        let left_pins = this.state.a_pins.slice();
        left_pins.splice( left_pins.indexOf(this.state.btn_pin), 1);

        this.setState({
            open: false, 
            a_pins: left_pins, 
            btn_pin: '',
            btn_name: '',
            btn_state: false
        });
    }
  
    render() {  
      return (
        <div>
            <Button variant='raised' size="medium" color="primary" onClick={this.handleClickOpen}>
                Add
            </Button>

            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={this.state.open}
                onClose={this.handleClose}
            >
                <DialogTitle>Criar botão</DialogTitle>

                <DialogContent>
                    <form style={styles.root}>
                        <FormControl style={styles.formControl}>
                            <InputLabel>Rótulo</InputLabel>
                            <Input 
                                id="btn_name" 
                                onChange={this.handleChange('btn_name')}
                            />
                        </FormControl>

                        <FormControl style={styles.formControl}>
                            <InputLabel>Pino</InputLabel>
                            <Select
                                value={this.state.btn_pin}
                                onChange={this.handleChange('btn_pin')}
                                input={<Input id="btn_pin" />}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {this.state.a_pins.map(pin => {
                                    return(
                                        <MenuItem key={pin} value={pin}>{pin}</MenuItem>
                                    );
                                })}

                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    value="btn_state"
                                    color="secondary"
                                    checked={this.state.btn_state}
                                    onChange={this.handleState('btn_state')}
                                />
                            }
                            label="Estado"
                            style={{margin: 10}}
                        />
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>

                    <Button onClick={this.createBtn} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
      );
    }
}

class EditBtn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            label: '',
            btn: ''
        };
        
    }  

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({
            open: false,
            btn_name: '',
            btn: ''
        });
    };

    handleState = name => event => {        
        this.setState({ [name]: event.target.checked });
    };

    handleChange = name => event => {         
        let btn = this.props.btns[event.target.value];

        this.setState({ btn });       
        this.setState({ [name]: btn.name });
    };

    handleEdit = name => event => {
        let update = this.state.btn;
        if(name === 'state'){
            update[name] = event.target.checked;
        }else {
            update[name] = event.target.value;
        }
        
        this.setState({ btn: update});
         
    };

    handleUpdate = () => {
        this.props.callback(this.state.btn);

        this.setState({
            open: false,
            btn_name: '',
            btn: ''
        })
    }

    editForm(btn) {
        return(
            <form style={styles.root}>
                <FormControl style={styles.formControl}>
                    <InputLabel>Rótulo</InputLabel>
                    <Input 
                        value={btn.name}
                        id="btn_name" 
                        onChange={this.handleEdit('name')}
                    />
                </FormControl>

                <FormControl style={styles.formControl}>
                    <InputLabel>Pino</InputLabel>
                    <Select
                        value={btn.pin}
                        onChange={this.handleEdit('pin')}
                        input={<Input id="btn_pin" />}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={
                        <Switch
                            value="btn_state"
                            color="secondary"
                            checked={btn.state}
                            onChange={this.handleEdit('state')}
                        />
                    }
                    label="Estado"
                    style={{margin: 10}}
                />
            </form>
        );      
    }

    render() {        
        return(
            <div>
                <Button variant='raised' size="medium" color="primary" style={{margin: 5}} onClick={this.handleClickOpen}>
                    Edit
                </Button>

                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>Editar botão</DialogTitle>

                    <DialogContent>
                        <form style={styles.root}>
                            <FormControl style={styles.formControl}>
                                <InputLabel>Botão</InputLabel>
                                <Select
                                    value={this.state.label}
                                    onChange={this.handleChange('label')}
                                    input={<Input id="editar_btn" />}
                                >
                                    <MenuItem value=""> <em>None</em> </MenuItem>

                                    {this.props.btns.map( btn => {
                                        return(
                                            <MenuItem key={btn.key} value={btn.key}>{btn.name}</MenuItem>
                                        );
                                    })}

                                </Select>
                            </FormControl> 
                        </form>

                        {(this.state.btn !== '') && this.editForm(this.state.btn) }
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>

                        <Button onClick={this.handleUpdate} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
  
export default class KeyboardCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.view,
            btns: []
        }
    }

    insertBtn = btn => {
        let updateBtns = this.state.btns.slice();
        updateBtns.push({key: updateBtns.length, ...btn});

        this.setState({ btns: updateBtns });
    };

    updateBtn = btn => {
        let updateBtns = this.state.btns.slice();
        updateBtns[btn.key] = btn;

        this.setState({btns: updateBtns});
        
    };

    handleKeyboardSwitch = btn => {
        let updateBtns = this.state.btns.slice();
        updateBtns[btn.key] = {...btn, state: !btn.state};

        this.setState({ btns: updateBtns });
       
    };

    handleHide = card => {
        let update = !this.state.show;
        this.setState({ show: update }); 
        this.props.callback(card);
    };

    handleSave = (btns) => {
        saveKeyboard(btns);
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
                        title="Keyboard"
                        action={
                            <IconButton>
                                <VisibilityOff  onClick={() => this.handleHide('keyboard')} />
                            </IconButton>
                        }
                    />
                    
                    <CardContent>
                        <FormControl component="fieldset">
                            <FormGroup>
                                {this.state.btns.map( btn => {
                                    return(
                                        <FormControlLabel
                                            key={btn.key}
                                            control={
                                            <Switch
                                                checked={btn.state}
                                                pin={btn.pin}
                                                onChange={() => this.handleKeyboardSwitch(btn) }
                                            />
                                            }
                                            label={btn.name}
                                            />
                                    );
                                })}
                            </FormGroup>
                        </FormControl>
                    </CardContent>

                    <CardActions>
                        <AddBtn callback={this.insertBtn}/>
                        <EditBtn btns={this.state.btns} callback={this.updateBtn}/>
                        <Button 
                            variant='raised' 
                            size="medium" 
                            color="primary" 
                            style={{margin: 5}} 
                            onClick={() => this.handleSave(this.state.btns)} 
                        >
                            Save
                        </Button>
                    </CardActions>

                </Card>
            </Grid>
        );
    }
}