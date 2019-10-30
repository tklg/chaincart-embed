import React from 'react'
import './index.scss'
import { money, api } from '../util'
import { CardElement, injectStripe } from 'react-stripe-elements'

class Checkout extends React.Component {
  state = {
    discount: '',
    error: ''
  }

  handleSubmit = async (e) => {
    const { token } = await this.props.stripe.createToken({ name: window.chainLayer.config })
    console.log(token)
  }

  handleRedeemDiscount = async e => {
    if (!this.state.discount.trim().length) return
    const res = await window.fetch(api.apiUrl(`/cc/${window.chainLayer.config}/discount/${this.state.discount.trim()}`, {
      method: 'GET'
    }))
    this.setValue('discount', '')
    if (res.status === 200) {
      const json = await res.json()
      this.props.addDiscount(json)
      this.setValue('error', '')
    } else {
      this.setValue('error', 'Invalid discount code')
    }
  }

  setValue = (k, v) => {
    this.setState({
      [k]: v
    })
  }

  renderDiscount = (x, i, a) => {
    return (
      <li key={i}><span data-cc-key>{x.code}</span><span data-cc-value>-{x.type === 0 ? `${x.amount / 100}%` : money.fmt(x.amount)}</span></li>
    )
  }

  render () {
    let total = this.props.items.reduce((a, x) => a + (x.price * x.count), 0)

    for (const dis of this.props.discounts) {
      if (dis.type === 0) {
        total *= (1 - (dis.amount / 10000))
      } else {
        total -= dis.amount
      }
    }

    return (
      <div className='ccart-checkout'>
        <header>
          <svg viewBox='0 0 24 24' onClick={this.props.onCart}>
            <path d='M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z' />
          </svg>
          <span>Checkout</span>
        </header>
        <main>
          <div className='ccart-form'>
            <p>Payment information</p>
            <CardElement />

            <p>Discount code</p>
            <div className='ccart-width-limit'>
              <input placeholder='SAVEBIG' value={this.state.discount} onChange={e => this.setValue('discount', e.target.value)} />
              <button onClick={this.handleRedeemDiscount}>Redeem</button>
            </div>

            <p className='ccart-error'>{this.state.error}</p>
          </div>
          <div className='ccart-discounts'>
            <p>Active discounts</p>
            <ul>{this.props.discounts.map(this.renderDiscount)}</ul>

            <div className='total'>{money.fmt(total)}</div>
          </div>
        </main>
        <footer>
          <div className='expand secure'>Securely processed by Stripe</div>
          <button onClick={this.handleSubmit}>Purchase</button>
        </footer>
      </div>
    )
  }
}

export default injectStripe(Checkout)
