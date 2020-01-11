(ns exchange
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [string :as string]
            [asset :as asset]
            [money :as money]))

(s/def ::portfolio (s/coll-of ::money/money :min-count 1))

(s/def ::id ::string/lower-case-alpha)

; TODO add taker and maker fees
(s/def ::exchange (s/keys :req-un [::id ::portfolio]))

(comment
  (gen/generate (s/gen ::portfolio))
  (gen/sample (s/gen ::exchange))
  ())

