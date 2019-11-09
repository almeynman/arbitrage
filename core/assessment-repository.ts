import { Assessment } from './assessment'

export interface AssessmentRepository {
  save(assessment: Assessment): Promise<void>
}
