import { xdrEnumToConstant } from '@/utils/xdrEnumToConstant'

export const BLOCK_REASONS = Object.freeze(
  xdrEnumToConstant('BlockReasons')
)

/*
  BLOCK_REASONS.kycUpdate
  BLOCK_REASONS.suspiciousBehavior
  BLOCK_REASONS.tooManyKycUpdateRequest
 */
