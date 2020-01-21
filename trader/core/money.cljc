(ns money
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [asset :as asset]))

(def min-amount 1)
(defn gen-amount [min] (gen/large-integer* {:min min}))

;TODO is the following a problem? (s/conform ::amount 1231.0) -> true
(s/def ::amount
  (s/with-gen pos-int?
              (fn [] (gen-amount min-amount))))

(defn pow [a b] (reduce * 1 (repeat b a)))
(def gen-digit (gen/elements (range 10)))
(defn gen-amount-with-precision [precision]
  (if (= precision 0) (gen/generate (s/gen ::amount))
                      (->> precision
                           (pow 10)
                           (* (gen/generate gen-digit))
                           (+ (gen-amount-with-precision (- precision 1))))))
(def gen-money
  (gen/fmap
    (fn [{precision :precision :as asset}]
      (->> (gen-amount-with-precision precision)
           (assoc {:asset asset} :amount)))
    (s/gen ::asset/asset)))
(s/def ::money
  (s/with-gen
    (s/keys :req-un [::asset/asset ::amount])
    (fn [] gen-money)))


(comment
  (gen/sample (s/gen ::amount))
  (s/conform ::amount 1231)
  (gen/sample gen-digit)
  (gen-amount-with-precision 10)
  (gen/sample gen-money)
  (gen/sample (s/gen ::money)))
