import Assessment from 'core/assessment'

export default interface OpportunityRepository {
  save(assessment: Assessment): Promise<void>
}
