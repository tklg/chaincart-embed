import React from 'react'
import './index.scss'

const fmt = (n) => {
  return `$${(n / 100).toFixed(2)}`
}

export default class Cart extends React.Component {
  renderRow = (x, i, a) => {
    return (
      <tr>
        <td>{x.name}</td>
        <td>{x.description}</td>
        <td>
          <input type='number' min='0' step='1' value={x.count} onChange={e => this.props.setCount(x.id, e.target.value)} />
        </td>
        <td>{fmt(x.price)}</td>
        <td><span className='remove' onClick={e => this.props.removeItem(x.id)}>Remove</span></td>
      </tr>
    )
  }

  render () {
    const total = this.props.items.reduce((a, x) => a + (x.price * x.count), 0)
    return (
      <div className='ccart-cart'>
        <header>{window.chainLayer.cartName}</header>
        <main className='table-container'>
          {this.props.items.length
            ? (
              <table cellSpacing='0' cellPadding='0'>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Price (ea)</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map(this.renderRow)}
                </tbody>
              </table>
            ) : <div className='table-empty'>Cart is empty</div>}
        </main>
        <footer>
          <div className='total'><span>Total:</span><span className='value'>{fmt(total)}</span></div>
          <button>Checkout</button>
        </footer>
      </div>
    )
  }
}
