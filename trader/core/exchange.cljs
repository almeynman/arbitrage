(ns exchange
  (:require [cljs.spec.alpha :as s]
            [cljs.spec.test.alpha :as stest]
            [clojure.test.check.generators :as gen]
            [string :as string]
            [asset :as asset]))

(s/def ::balance
  (s/with-gen pos-int?
              (fn [] (gen/large-integer* {:min 1}))))

(s/def ::portfolio-item (s/keys :req-un [::balance ::asset/asset]))

(s/def ::portfolio (s/coll-of ::portfolio-item :min-count 1))

(s/def ::id ::string/lower-case-alpha)

(s/def ::exchange (s/keys :req-un [::id ::portfolio]))

(s/def ::pair (s/coll-of ::exchange :count 2 :distinct true))

(comment
  (gen/sample (s/gen ::balance) 100)
  (gen/sample (s/gen ::exchange))
  ())

