import OpportunityRepository from 'implementation/opportunity-repository'
import { CollectionReference } from '@google-cloud/firestore'
import Assessment from 'core/assessment'

export default class FirestoreOpportunityRepository implements OpportunityRepository {
  constructor(
    private collection: CollectionReference
  ) {}

  async save(assessment: Assessment): Promise<void> {
    this.collection.add(assessment)
  }
}
