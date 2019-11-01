import Skeleton, { SkeletonContainer } from './SkeletonLoader'
import React from 'react'

export const SinglePostLoading = () => (
  <SkeletonContainer>
    <Skeleton width="50%" />
    <br />
    <Skeleton width="60%" size="small" />
    <Skeleton width="80%" size="small" />
    <Skeleton width="80%" size="small" />
  </SkeletonContainer>
)

export const MultiplePostLoading = () => (
  <>
    <SinglePostLoading />
    <SinglePostLoading />
    <SinglePostLoading />
  </>
)

export const TagSidebarLoading = () => (
  <SkeletonContainer>
    <Skeleton />
    <Skeleton width="50%" size="small" />
    <Skeleton width="100%" size="small" />
  </SkeletonContainer>
)
