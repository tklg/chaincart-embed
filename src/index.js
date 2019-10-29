import React from 'react'
import ReactDOM from 'react-dom'
import Cart from './Cart'
import './index.scss'

const store = window.localStorage
const STOR_KEY = 'CHAINCART_STORE'

const saveItems = items => {
  store.setItem(STOR_KEY, JSON.stringify(items))
}
const loadItems = () => {
  return JSON.parse(store.getItem(STOR_KEY) || '[]')
}

class App extends React.Component {
  state = {
    cartOpen: false,
    cartItems: [{
      id: 'abcd',
      name: 'test item',
      description: 'desc',
      price: 1000,
      count: 1
    }, {
      id: 'dcba',
      name: 'test item 2',
      description: 'desc 2',
      price: 150,
      count: 3
    }]
  }

  openCart = (b) => {
    this.setState({
      cartOpen: b
    })
  }

  addItem = (id) => {
    this.setState({
      cartItems: []
    }, () => {
      saveItems(this.state.cartItems)
    })
  }

  removeItem = (id) => {
    this.setState({
      cartItems: this.state.cartItems.filter(x => x.id !== id)
    }, () => {
      saveItems(this.state.cartItems)
    })
  }

  setCount = (id, v) => {
    const items = [...this.state.cartItems]
    const ind = items.findIndex(x => x.id === id)
    items[ind].count = v
    this.setState({
      cartItems: items
    })
  }

  componentDidMount () {
    const openers = document.querySelectorAll('[data-ccart-view-cart]')
    for (const opener of openers) {
      opener.addEventListener('click', e => this.openCart(true))
    }
    (async () => {
      // const res = await fetch
    })()
  }

  render () {
    return (
      <div className={'ccart-container' + (this.state.cartOpen ? ' active' : '')}>
        <div className='ccart-close' onClick={e => this.openCart(false)}>✕</div>
        <Cart
          open={this.state.cartOpen}
          items={this.state.cartItems}
          setCount={this.setCount}
          removeItem={this.removeItem}
        />
      </div>
    )
  }
}

window.chainLayer = window.chainLayer || {
  cartName: 'test'
}

ReactDOM.render(<App />, document.getElementById('chaincart-container'))
