import { Assessment } from './assessment'
import { TaskEither } from 'fp-ts/lib/TaskEither'

export type SaveAssessment = (assessment: Assessment) => TaskEither<Error, Assessment>
