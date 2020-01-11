(ns price
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [big.js :as big]))

(def price-regex #"^\d+\.\d+$")
(defn valid-price? [p]
  (and (re-matches price-regex p)
       (not= "0.0" p)))
(def gen-price
  (gen/fmap
    (fn [[integer fraction]] (str integer "." fraction))
    (gen/tuple (gen/large-integer* {:min 1}) (gen/large-integer* {:min 0}))))
(s/def ::price (s/with-gen (s/and string? valid-price?) (fn [] gen-price)))

(defn add [& prices]
  (->> prices
       (map (fn [p] (big/Big. p)))
       (reduce (fn [a b] (.plus a b)))
       (.toString)))
(s/fdef add
        :args (s/coll-of ::price)
        :ret ::price)

; TODO multiplying prices does not really make sense
; so move to lib and call smth like non-negative big decimal string
(defn times [& prices]
  (->> prices
       (map (fn [p] (big/Big. p)))
       (reduce (fn [a b] (.times a b)))
       (.toString)))
(s/fdef times
        :args (s/coll-of ::price)
        :ret ::price)

(defn div [& prices]
  (->> prices
       (map (fn [p] (big/Big. p)))
       (reduce (fn [a b] (.div a b)))
       (.toString)))
(s/fdef div
        :args (s/coll-of ::price)
        :ret ::price)

(defn gt [& prices]
  (->> prices
       (map (fn [p] (big/Big. p)))
       (reduce (fn [a b] (.gt a b)))))
(s/fdef gt
        :args (s/coll-of ::price :count 2)
        :ret boolean?)

(comment
  (gen/sample (s/gen ::price) 10)
  (s/conform ::price "0.0")
  (valid-price? "1.1")
  (add "1.1" "1.2")
  (.toString (big/Big. "1"))
  (s/exercise-fn add)
  (s/exercise-fn times)
  (s/exercise-fn div)
  (s/exercise-fn gt)
  ())

