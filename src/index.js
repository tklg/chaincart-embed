import React from 'react'
import ReactDOM from 'react-dom'
import Modal from './Modal'
import Cart from './Cart'
import Checkout from './Checkout'
import './index.scss'
import { Elements, StripeProvider } from 'react-stripe-elements'
const STRIPEKEY = 'pk_test_lloNPiT8OoFcXR0dwNzmCZzo00qGg2RUuK'

const store = window.localStorage
const STOR_KEY = 'CHAINCART_STORE'

const saveItems = items => {
  store.setItem(STOR_KEY, JSON.stringify(items))
}
const loadItems = () => {
  return JSON.parse(store.getItem(STOR_KEY) || '[]')
}

if (window.location.hostname === 'localhost') {
  saveItems([{
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
  }])
}

class App extends React.Component {
  state = {
    cartOpen: true,
    checkoutOpen: true,
    cartItems: [],
    discounts: []
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

  addDiscount = json => {
    if (this.state.discounts.find(x => x.code === json.code)) return
    this.setState({
      discounts: this.state.discounts.concat(json)
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

  onCheckout = (b) => {
    this.setState({
      checkoutOpen: b
    })
  }

  async componentDidMount () {
    const openers = document.querySelectorAll('[data-ccart-view-cart]')
    for (const opener of openers) {
      opener.addEventListener('click', e => this.openCart(true))
    }
    this.setState({ cartItems: loadItems() })
  }

  render () {
    return (
      <div className={'ccart-container' + (this.state.cartOpen ? ' active' : '')}>
        <div className='ccart-close' onClick={e => this.openCart(false)}>✕</div>
        <Modal>
          {!this.state.checkoutOpen ? (
            <Cart
              open={this.state.cartOpen}
              items={this.state.cartItems}
              setCount={this.setCount}
              removeItem={this.removeItem}
              onCheckout={e => this.onCheckout(true)}
            />
          ) : (
            <StripeProvider apiKey={STRIPEKEY}>
              <Elements>
                <Checkout
                  discounts={this.state.discounts}
                  addDiscount={this.addDiscount}
                  items={this.state.cartItems}
                  onCart={e => this.onCheckout(false)}
                />
              </Elements>
            </StripeProvider>
          )}
        </Modal>
      </div>
    )
  }
}

window.chainLayer = window.chainLayer || {
  config: 'w7m7kmek',
  cartName: 'test'
}

ReactDOM.render(<App />, document.getElementById('chaincart-container'))
