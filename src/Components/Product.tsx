import * as React from "react";
import { store } from "../app";
import { ProductActionCreator, ProductAction } from '../Actions'
import { RootState } from '../Reducers'
import { bindActionCreators, Action } from 'redux'
import { connect, Dispatch } from 'react-redux';
import { AssigneeActionCreator, AssigneeAction, ReloadActionCreater } from '../Actions'
// function eventHandler() {
//   // store.dispatch(); /with action creator

//   let rootState = store.getState();
// }

export interface ProductsProps { products?: any, MessageKey?: string, dispatch?: Dispatch<RootState> }
interface ProductState { editMode: boolean, products: any, productList: any[], newProductId: string }

class Products extends React.Component<ProductsProps, ProductState> {
  constructor(props: ProductsProps) {
    super(props);
    this.state = { editMode: false, productList: [], products: this.props.products, newProductId: "" };
    this.editProducts = this.editProducts.bind(this);
    this.add = this.add.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveProducts = this.saveProducts.bind(this);
    this.cancelProductAdd = this.cancelProductAdd.bind(this);
  };
  //setState renders

  setTheState(state: any) {
    this.setState(state);
  }
  saveProducts() {
    let currentContext = this;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://iswebdev.pc.factset.com/rpd/api/v2/rpd/" + this.props.MessageKey + "/products", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.withCredentials = true;
    xhr.send(JSON.stringify(this.state.productList));
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        let pl = currentContext.state.productList;
        currentContext.props.dispatch(ReloadActionCreater(true));
        currentContext.setState({ editMode: false, products: currentContext.props.products.concat(pl), productList: [], newProductId: "" });
      }
    }

  }
  cancelProductAdd() {
    this.setState({ editMode: false, products: this.props.products, productList: [], newProductId: "" });
  }
  add() {
    let temp = this.state.productList;
    temp.push({ Id: this.state.newProductId });
    let t = { editMode: this.state.editMode, products: this.state.products, productList: temp, newProductId: "" };
    this.setState(t);
  }
  editProducts() {
    this.setState({ editMode: true, products: this.props.products, productList: [], newProductId: "" });
  };
  render() {
    var productList = this.state.productList;
    if (this.state.editMode) {
      return (
        <div style={{ width: '30%', border: '1px solid', padding: '2px' }}>
          <input type="text" value={this.state.newProductId} onChange={this.handleChange} /> <button onClick={this.add}>ADD</button>
          <div style={{ padding: '2px' }}>{productList.map(product => {
            return <div>{product.Id} </div>
          })}</div>
          <div>
            <button onClick={this.saveProducts}>Save</button>
            <button style={{ float: 'right' }} onClick={this.cancelProductAdd}>Cancel</button>
          </div>
        </div>
      )
    }
    else {
      return (
        <div style={{ color: 'blue' }}> <b> Products: </b> <span> {this.state.products.map(p => { return p.Name ? p.Name : p.Id }).join(", ")}</span>
          <button onClick={this.editProducts}>Edit</button>
        </div>
      )
    }
  }
  handleChange(evt: any): any {
    let newProductId = evt.target.value;
    this.setState({ editMode: this.state.editMode, productList: this.state.productList, products: this.state.products, newProductId: newProductId });
  }
}

//------------------------ CONTAINER-----------------------------

function mapStateToProps(rootState: any, props: ProductsProps): ProductsProps {  //props
  return {
    MessageKey: rootState.RPD.MessageKey,
    products: rootState.RPD.Products
  };
}

function mapDispatchToProps(dispatch): any {
  return {
    actions: bindActionCreators(ProductActionCreator, dispatch)
  };
}

function mergeProps(): any {

}


const ProductsContainer = connect(mapStateToProps)(Products); //, mapDispatchToProps, mergeProps

export default ProductsContainer;


