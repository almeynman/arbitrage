import Assessment from '../assessment'

export default function persistAssessment(
  assessment: Assessment,
  persist: (assessment: Assessment) => void
) {
    persist(assessment)
}
