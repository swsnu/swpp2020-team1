import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Container, Button, TextField } from "@material-ui/core";

class ItemConfirm extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  state = {
    name: '',
    barcode: '',
    expiration_date: '',
    container: this.containers[0],
  }
  
  onclickAddItemButton = () => {

  }

  onClickConfirmButton = () => {

  }

  onClickWebcamModeButton = () => {

  }

  render() {
    console.log("render ",this.state.container)
    // for testing. In the future, this wll be given as props
    const items = [
      {'name': 'item1', 'barcode_num': 100, 'expiration_date': '20201111', 'category_id': 1, 'container': 'freezer', 'count': 1},
      {'name': 'item2', 'barcode_num': 100, 'expiration_date': '20201111', 'category_id': 1, 'container': 'freezer', 'count': 2},
      {'name': 'item3', 'barcode_num': 100, 'expiration_date': '20201111', 'category_id': 1, 'container': 'freezer', 'count': 3},
    ];
    const newItems = items.map(item => {
      return (
        <Container>
          <Typography>{item.name} - {item.barcode_num} - {item.expiration_date}</Typography>
          <Button className="">edit</Button>
        </Container>
      );
    });

    return (
      <div className="ItemConfirm">
        <Typography variant="h5">New Items</Typography>
        {newItems}
        <Container>
          <form>
            <TextField className="item_name_create" label="Name" />
            <TextField className="item_barcode_create" label="Barcode number" />
            <TextField className="item_expiration_date_create" label="Expiration date" />
            <TextField 
              select 
              value={this.state.container} 
              onChange={e => this.setState({container: e.target.value})} 
              className="item_container_create" 
              label="Container">
              {this.containers.map(c => (
                <option>
                  {c}
                </option>
              ))}
            </TextField>

          </form>
          <Button className="btn_add_item" onClick={this.onclickAddItemButton}>Add</Button>
        </Container>
        <Button className="btn_confirm" onClick={this.onClickConfirmButton}>Confirm</Button>
        <Button className="btn_webcam_mode" onClick={this.onClickWebcamModeButton}>Go to automatic mode</Button>
      </div>
     );
  }
}

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemConfirm);