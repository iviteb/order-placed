import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import parcelify from '@vtex/delivery-packages'
import OrderHeader from './OrderHeader'
import CustomerInfo from '../CustomerInfo'
import PaymentMethod from '../Payment/PaymentMethod'
import Shipping from '../Shipping/Shipping'
import OrderTotal from './OrderTotal'
import StorePickUp from '../StorePickUp/StorePickUp'
import OrderSplitNotice from './OrderSplitNotice'
import OrderSection from './OrderSection'
import { profileShape } from '../../shapes'
import {
  getDeliveryPackagesFromParcels,
  getPickUpPackagesFromParcels,
  getTakeAwayPackagesFromParcels,
} from '../../utils'

const OrderInfo = ({ order, profile, splitOrder }) => {
  const parcels = parcelify(order)
  const delivery = getDeliveryPackagesFromParcels(parcels)
  const pickup = getPickUpPackagesFromParcels(parcels)
  const takeaway = getTakeAwayPackagesFromParcels(parcels)
  const multipleDeliveries = delivery.length > 1
  const paymentsData = order.paymentData.transactions[0].payments

  return (
    <Fragment>
      <div className="mv6 w-80-ns w-90 center">
        <OrderHeader orderInfo={order} splitOrder={splitOrder} />
        {multipleDeliveries && (
          <OrderSplitNotice
            deliveries={delivery.length}
            pickups={pickup.length}
            takeaways={takeaway.length}
          />
        )}
        <CustomerInfo profile={profile} />
        <OrderSection>
          {paymentsData.map((payment, index) => (
            <div key={index} className="flex flex-column pb6">
              <PaymentMethod payment={payment} />
            </div>
          ))}
        </OrderSection>
        {pickup.length > 0 && (
          <OrderSection>
            <StorePickUp pickUpPackages={pickup} />
          </OrderSection>
        )}
        {delivery.length > 0 && (
          <OrderSection>
            <Shipping deliveryPackages={delivery} />
          </OrderSection>
        )}
        <OrderTotal
          items={order.items}
          totals={order.totals}
          orderValue={order.value}
        />
      </div>
      <hr className="bg-muted-4 bt b--muted-4" />
    </Fragment>
  )
}

OrderInfo.propTypes = {
  order: PropTypes.object.isRequired,
  profile: profileShape.isRequired,
  splitOrder: PropTypes.bool.isRequired,
}

export default OrderInfo