import { HttpTypes } from "@medusajs/types"

import { isStripe, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const paymentDateTimeFormatter = new Intl.DateTimeFormat("fr-CH", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "UTC",
})

const formatPaymentDateTime = (value?: string | Date | null) => {
  if (!value) {
    return "-"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return paymentDateTimeFormatter.format(date)
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  if (!payment) {
    return (
      <p className="text-grayscale-500">No payment information available</p>
    )
  }

  return (
    <p className="text-grayscale-500">
      {paymentInfoMap[payment.provider_id].title}
      <br />
      {isStripe(payment.provider_id) && payment.data?.card_last4
        ? `**** **** **** ${payment.data.card_last4}`
        : `${convertToLocale({
            amount: payment.amount,
            currency_code: order.currency_code,
          })} paid at ${formatPaymentDateTime(payment.created_at)}`}
    </p>
  )
}

export default PaymentDetails
