import React from 'react'
/**
 * React hook that will track previous value of state/props
 * @param {any} value
 */
function usePrevious(value) {
  const ref = React.useRef()
  React.useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default usePrevious
