type TotalProps = {
  /** Number to display. The component does no math: it only renders. */
  value: number
}

/** Presentational component: shows the total it receives through props. */
export function Total({ value }: TotalProps) {
  return <p className="total">Total: {value}</p>
}
