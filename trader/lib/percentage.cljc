(ns percentage
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]))

(def base 10000)
(def gen-base (gen/choose base base))
(s/def ::base
  (s/with-gen
    pos-int?
    (fn [] gen-base)))
(def gen-value (gen/choose 0 base))
(s/def ::value
  (s/with-gen
    pos-int?
    (fn [] gen-value)))
(s/def ::percentage (s/keys :req-un [::value ::base]))
(defn to-base-1 [{value :value base :base}] (/ value base))

(comment
  (gen/sample (s/gen ::percentage))
  (gen/sample (s/gen ::base))
  (gen/sample (s/gen ::value)))
