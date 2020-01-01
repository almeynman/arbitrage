(ns pair-trader.test
  (:require [clojure.test :refer :all]
            [auxon.clj-cucumber :refer [run-cucumber step]]
            [auxon.clj-cucumber.generative :as cgen :refer (generator property step)]
            [clojure.test.check :as tc]
            [clojure.test.check.generators :as gen]))

(def test-state (atom {}))

(def steps
  [(step :Given #"^some setup$"
         (fn some-setup [_]
           {:setup-happened true}))

   (step :When #"^I do a thing$"
         (fn I-do-a-thing [state]
           (assoc state :thing-happened true)))

   (step :Then #"^the setup happened$"
         (fn the-setup-happened [state]
           (assert (:setup-happened state))
           state))

   (step :Then #"^the thing happened$"
         (fn the-thing-happened [state]
           (assert (:thing-happened state))
           state))])

(deftest cucumber
         (is (= 0 (run-cucumber "test/pair_trader/test.feature" steps))))

