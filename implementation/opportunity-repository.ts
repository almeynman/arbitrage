import { Assessment } from 'core'

export default interface OpportunityRepository {
  save(assessment: Assessment): Promise<void>
}
