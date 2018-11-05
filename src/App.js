import React, { Component } from 'react';
import { connect } from 'react-redux';
import { simpleAction, addTodo } from './actions/simpleActions'

import logo from './logo.svg';
import './App.css';

class App extends Component {

  simpleAction = (event) => {
    this.props.simpleAction();
  }

  addTodoAction = (event) => {
    this.props.onAddTodo({title: "a todo", userId: "myself"});
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={this.simpleAction}>Test redux action</button>
          <button onClick={this.addTodoAction}>Test redux action</button>
          <pre>{JSON.stringify(this.props)}</pre>
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
 });

 const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction()),
  onAddTodo: todo => dispatch(addTodo(todo))
 })


 export default connect(mapStateToProps, mapDispatchToProps)(App);
