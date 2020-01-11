(ns order
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [price :as price]
            [asset :as asset]
            [exchange :as exchange]))

(s/def ::side #{:buy :sell})
(s/def ::exchange-id ::exchange/id)
(s/def ::amount pos-int?)
(s/def ::order (s/keys :req-un [::side ::exchange-id ::asset/symbol ::amount ::price/price]))

(defn is-buy-order? [{side :side}] (= :buy side))
(defn is-sell-order? [{side :side}] (= :sell side))
(defn flip-side [o]
  (case (o :side)
    :buy (assoc o :side :sell)
    :sell (assoc o :side :buy)))

(comment
  (gen/sample (s/gen ::order) 2)
  (def test-order (gen/generate (s/gen ::order)))
  (flip-side test-order)
  (s/conform ::price "0.0")
  (valid-price? "1.1")
  ())

