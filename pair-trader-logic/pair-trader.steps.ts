import { binding, given, then, when} from 'cucumber-tsflow';
import { assert } from 'chai';
import { Assessment } from 'business-logic'
import 

@binding()
export class BankAccountSteps {
  private assessment: Assessment = ;

  @given(/the Assessment is an OpenOpportunity/)
  public givenTheAssessmentIsOpenOpportunity(amount: number) {
    this.accountBalance = amount;
  }

  @when(/\$(\d*) is deposited/)
  public deposit(amount: number) {
    this.accountBalance = Number(this.accountBalance) + Number(amount);
  }

  @then(/The bank account balance should be \$(\d*)/)
  public accountBalanceShouldEqual(expectedAmount: number) {
    assert.equal(this.accountBalance, expectedAmount);
  }
}
