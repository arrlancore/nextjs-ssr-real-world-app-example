import React from 'react'
import styled, { keyframes } from 'styled-components'
import { string } from 'prop-types'

export const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 1rem;
  padding: 8px;
  border: 1px solid #f7f7f7;
  margin: 1rem 0;
`

const LineAnimation = keyframes`
  0% {
    background-position: -100px;
  }
  100% {
    background-position: 2000px;
  }
`

const Line = styled.div`
  display: inline-block;
  background-image: linear-gradient(90deg, #eee 0px, #f7f7f7 60px, #eee 150px);
  background-size: 700px;
  animation: ${LineAnimation} 2s infinite linear;
  width: ${props => props.width || '100%'};
  height: ${props => props.height};
  border-radius: 1rem;
  margin: 4px;
`

const Skeleton = ({ size, width }) => {
  let height = '40px;' //default is 40px
  if (size === 'small') {
    height = '20px'
  }
  if (size === 'large') {
    height = '60px'
  }
  return <Line height={height} width={width} />
}

Skeleton.propTypes = {
  size: string,
  width: string
}

export default Skeleton
