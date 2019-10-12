import { Assessment } from 'core'

export default interface AssessmentRepository {
  save(assessment: Assessment): Promise<void>
}
